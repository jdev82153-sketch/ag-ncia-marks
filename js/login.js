(function () {
  var welcome = document.getElementById('welcome');
  var stage = document.getElementById('stage');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  setTimeout(function () {
    stage.classList.add('in');
    welcome.classList.add('out');
    setTimeout(function () { welcome.style.display = 'none'; }, reduce ? 0 : 950);
  }, reduce ? 300 : 2600);

  var key = document.getElementById('key');
  var toggle = document.getElementById('toggle');
  toggle.addEventListener('click', function () {
    var show = key.type === 'password';
    key.type = show ? 'text' : 'password';
    toggle.setAttribute('aria-label', show ? 'Ocultar key' : 'Mostrar key');
  });

  var empresa = document.getElementById('empresa');
  var lembrar = document.getElementById('lembrar');
  try {
    var salvo = localStorage.getItem('marks_empresa');
    if (salvo) { empresa.value = salvo; lembrar.checked = true; }
  } catch (e) {}

  var msg = document.getElementById('msg');
  var btn = document.getElementById('entrar');

  function liberar() { btn.disabled = false; btn.textContent = 'Entrar'; }

  document.getElementById('loginForm').addEventListener('submit', async function (ev) {
    ev.preventDefault();
    msg.textContent = '';
    var nome = empresa.value.trim();
    var chave = key.value.trim();
    if (!nome || !chave) { msg.textContent = 'Preencha o nome da empresa e a key.'; return; }

    try {
      if (lembrar.checked) localStorage.setItem('marks_empresa', nome);
      else localStorage.removeItem('marks_empresa');
    } catch (e) {}

    btn.disabled = true; btn.textContent = 'Verificando...';
    try {
      var d = await Auth.entrar(nome, chave);
      if (!d) { msg.textContent = 'Nome da empresa ou key incorretos. Confira e tente de novo.'; liberar(); return; }
      Auth.salvar(nome, chave, d);
      location.href = 'dashboards/' + encodeURIComponent(d.nicho) + '.html';
    } catch (e) {
      msg.textContent = 'Não foi possível conectar. Tente de novo em instantes.';
      liberar();
    }
  });

  document.getElementById('esqueci').addEventListener('click', function (e) { e.preventDefault(); msg.textContent = 'Fale com a Agência Marks para receber sua key novamente.'; });
  document.getElementById('contato').addEventListener('click', function (e) { e.preventDefault(); msg.textContent = 'Fale com a Agência Marks para liberar seu acesso.'; });
})();

