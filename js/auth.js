// Validação sempre no servidor (função login_empresa do Supabase)
window.Auth = {
  entrar: async function (nome, key) {
    var r = await fetch(CONFIG.SUPABASE_URL + '/rest/v1/rpc/login_empresa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: CONFIG.SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ p_nome: nome, p_key: key })
    });
    if (!r.ok) throw new Error('rede');
    return await r.json(); // { nome, nicho } ou null
  },
  salvar: function (nome, key, d) {
    sessionStorage.setItem('marks_sessao', JSON.stringify({ nome: nome, key: key, nicho: d.nicho }));
  },
  ler: function () {
    try { return JSON.parse(sessionStorage.getItem('marks_sessao')); } catch (e) { return null; }
  },
  sair: function () {
    sessionStorage.removeItem('marks_sessao');
    location.replace('../index.html');
  },
  // Chamado em cada dashboard: revalida no servidor a cada abertura
  exigir: async function (nicho) {
    var s = Auth.ler();
    if (!s) { Auth.sair(); return null; }
    try {
      var d = await Auth.entrar(s.nome, s.key);
      if (!d) { Auth.sair(); return null; }
      if (d.nicho !== nicho) { location.replace(d.nicho + '.html'); return null; }
      return d;
    } catch (e) { Auth.sair(); return null; }
  }
};

