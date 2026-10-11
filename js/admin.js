(function () {
  // Para criar um nicho novo, acrescente o nome aqui e na lista do SQL.
  var NICHOS = ['advocacia', 'imobiliaria', 'contabilidade'];
  var U = CONFIG.SUPABASE_URL, K = CONFIG.SUPABASE_ANON_KEY;
  var token = sessionStorage.getItem('marks_admin');
  var lista = [];
  var $ = function (id) { return document.getElementById(id); };

  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function gerarKey() {
    var a = new Uint8Array(16); crypto.getRandomValues(a);
    return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  function copiar(txt, el) {
    navigator.clipboard.writeText(txt).then(function () {
      if (el) { var o = el.textContent; el.textContent = 'Copiada!'; setTimeout(function () { el.textContent = o; }, 1500); }
    });
  }
  function aviso(id, texto, ok) { var e = $(id); e.textContent = texto || ''; e.className = 'msg' + (ok ? ' ok' : ''); }

  async function api(path, opt) {
    var r = await fetch(U + '/rest/v1/' + path, Object.assign({
      headers: { 'Content-Type': 'application/json', apikey: K, Authorization: 'Bearer ' + token, Prefer: 'return=representation' }
    }, opt));
    if (r.status === 401) { sair(); throw new Error('sessao'); }
    if (r.status === 403) throw new Error('Sem permissão de administrador para esta ação.');
    if (r.status === 409) throw new Error('Já existe uma empresa com esse nome.');
    if (!r.ok) throw new Error('Erro ao falar com o servidor.');
    var t = await r.text();
    return t ? JSON.parse(t) : null;
  }

  function sair() {
    sessionStorage.removeItem('marks_admin'); token = null;
    $('painel').classList.add('hide'); $('login').classList.remove('hide');
  }

  async function carregar() {
    try {
      lista = await api('empresas?select=*&order=criado_em.desc', { method: 'GET' });
      $('lista').innerHTML = lista.length ? lista.map(function (e) {
        return '<tr><td>' + esc(e.nome) + '</td><td>' + esc(e.nicho) + '</td>' +
          '<td><span class="tag ' + (e.ativo ? 'on">Ativa' : 'off">Suspensa') + '</span></td>' +
          '<td><div class="acoes">' +
          '<button class="btn ghost sm" data-a="copiar" data-id="' + e.id + '">Copiar key</button>' +
          '<button class="btn ghost sm" data-a="nova" data-id="' + e.id + '">Nova key</button>' +
          '<button class="btn ghost sm" data-a="status" data-id="' + e.id + '">' + (e.ativo ? 'Suspender' : 'Ativar') + '</button>' +
          '<button class="btn ghost sm" data-a="excluir" data-id="' + e.id + '">Excluir</button>' +
          '</div></td></tr>';
      }).join('') : '<tr><td colspan="4" style="color:var(--muted)">Nenhuma empresa cadastrada ainda. Crie a primeira acima.</td></tr>';
      aviso('mLista', '');
    } catch (e) { if (e.message !== 'sessao') aviso('mLista', e.message); }
  }

  function abrirPainel() {
    $('login').classList.add('hide'); $('painel').classList.remove('hide');
    $('nicho').innerHTML = NICHOS.map(function (n) { return '<option value="' + n + '">' + n + '</option>'; }).join('');
    carregar();
  }

  $('fLogin').addEventListener('submit', async function (ev) {
    ev.preventDefault(); aviso('mLogin', '');
    var email = $('email').value.trim(), senha = $('senha').value;
    if (!email || !senha) { aviso('mLogin', 'Preencha e-mail e senha.'); return; }
    try {
      var r = await fetch(U + '/auth/v1/token?grant_type=password', {
        method: 'POST', headers: { 'Content-Type': 'application/json', apikey: K },
        body: JSON.stringify({ email: email, password: senha })
      });
      if (!r.ok) { aviso('mLogin', 'E-mail ou senha incorretos.'); return; }
      var d = await r.json();
      token = d.access_token; sessionStorage.setItem('marks_admin', token);
      $('senha').value = ''; abrirPainel();
    } catch (e) { aviso('mLogin', 'Não foi possível conectar. Tente de novo.'); }
  });

  $('fNova').addEventListener('submit', async function (ev) {
    ev.preventDefault(); aviso('mNova', ''); $('novaBox').style.display = 'none';
    var nome = $('nome').value.trim();
    if (!nome) { aviso('mNova', 'Digite o nome da empresa.'); return; }
    var chave = gerarKey();
    try {
      await api('empresas', { method: 'POST', body: JSON.stringify({ nome: nome, nicho: $('nicho').value, chave: chave }) });
      $('novaKey').textContent = chave; $('novaBox').style.display = 'block';
      $('nome').value = ''; carregar();
    } catch (e) { if (e.message !== 'sessao') aviso('mNova', e.message); }
  });

  $('copiarNova').addEventListener('click', function () { copiar($('novaKey').textContent, this); });

  $('lista').addEventListener('click', async function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    var emp = lista.find(function (x) { return x.id === b.dataset.id; }); if (!emp) return;
    try {
      if (b.dataset.a === 'copiar') { copiar(emp.chave, b); return; }
      if (b.dataset.a === 'nova') {
        if (!confirm('Gerar nova key para ' + emp.nome + '? A key antiga deixa de funcionar.')) return;
        var nk = gerarKey();
        await api('empresas?id=eq.' + emp.id, { method: 'PATCH', body: JSON.stringify({ chave: nk }) });
        $('novaKey').textContent = nk; $('novaBox').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (b.dataset.a === 'status') {
        await api('empresas?id=eq.' + emp.id, { method: 'PATCH', body: JSON.stringify({ ativo: !emp.ativo }) });
      }
      if (b.dataset.a === 'excluir') {
        if (!confirm('Excluir ' + emp.nome + ' de vez? Não dá para desfazer.')) return;
        await api('empresas?id=eq.' + emp.id, { method: 'DELETE' });
      }
      carregar();
    } catch (e) { if (e.message !== 'sessao') aviso('mLista', e.message); }
  });

  $('sair').addEventListener('click', sair);
  if (token) abrirPainel();
})();
