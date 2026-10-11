// Monta o dashboard a partir da configuração do nicho (window.NICHO)
(function () {
  var N = window.NICHO;
  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  Auth.exigir(N.id).then(function (s) {
    if (!s) return;
    document.title = N.nome + ' | Agência Marks';

    var menu = N.menu.map(function (m, i) {
      return '<a href="#" class="' + (i === 0 ? 'on' : '') + '">' + esc(m) + '</a>';
    }).join('');

    var kpis = N.kpis.map(function (k) {
      return '<div class="kpi"><span>' + esc(k.rotulo) + '</span><strong>' + esc(k.valor) + '</strong></div>';
    }).join('');

    var cab = N.tabela.colunas.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('');
    var linhas = N.tabela.linhas.map(function (l) {
      return '<tr>' + l.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>';
    }).join('');

    document.getElementById('app').innerHTML =
      '<aside class="side"><div class="logo">Agência <b>Marks</b></div><nav>' + menu + '</nav></aside>' +
      '<main class="conteudo">' +
        '<header class="topo"><div><h1>' + esc(N.nome) + '</h1><p>' + esc(s.nome) + '</p></div>' +
        '<button id="sair" class="sair">Sair</button></header>' +
        '<section class="kpis">' + kpis + '</section>' +
        '<section class="painel"><h2>' + esc(N.tabela.titulo) + '</h2>' +
          '<div class="rolagem"><table><thead><tr>' + cab + '</tr></thead><tbody>' + linhas + '</tbody></table></div>' +
          '<p class="aviso">Dados de exemplo. Troque pelos dados reais da empresa.</p></section>' +
        '<section class="painel"><h2>Atendente WhatsApp</h2>' +
          '<p class="aviso">Em breve: conversas, atendimentos do dia e status da IA aparecem aqui.</p></section>' +
      '</main>';

    document.getElementById('sair').onclick = Auth.sair;
    document.body.classList.remove('protegido');
  });
})();

