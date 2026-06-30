/* =====================================================
                MENU HAMBÚRGUER TABLET
===================================================== */

/*
  Criamos o botão dinamicamente pelo JavaScript.

  Motivo:
  - Não precisamos alterar o HTML.
  - O botão passa a existir em todas as páginas
    que utilizam este arquivo JS.
*/
const hamburgerBtn = document.createElement("button");

hamburgerBtn.className = "hamburger-btn";

/*
  Criamos a imagem que ficará dentro do botão.

  Inicialmente mostramos o ícone de abrir menu.
*/
const hamburgerIcon = document.createElement("img");

hamburgerIcon.src = "../assets/icons/menu-open.svg";
hamburgerIcon.alt = "Abrir menu";

/*
  Colocamos a imagem dentro do botão.
*/
hamburgerBtn.appendChild(hamburgerIcon);

/*
  Adicionamos o botão no body.
*/
document.body.appendChild(hamburgerBtn);

/* =====================================================
                    OVERLAY
===================================================== */

/*
  Criamos a camada escura que aparece
  quando a sidebar é aberta.

  Ela funciona parecido com o backdrop
  dos modais do relatório.
*/
const overlay = document.createElement("div");

overlay.className = "sidebar-overlay";

document.body.appendChild(overlay);

/* =====================================================
                FUNÇÕES PRINCIPAIS
===================================================== */

/*
  Fecha a sidebar.

  O que acontece:
  1. Remove a classe sidebar-open.
  2. Remove o overlay.
  3. Troca o ícone para o menu.
*/
function closeSidebar() {

  document.body.classList.remove("sidebar-open");

  overlay.classList.remove("active");

  hamburgerIcon.src = "../assets/icons/menu-open.svg";
}

/*
  Abre a sidebar.

  O que acontece:
  1. Adiciona a classe sidebar-open.
  2. Mostra o overlay.
  3. Troca o ícone para o X.
*/
function openSidebar() {

  document.body.classList.add("sidebar-open");

  overlay.classList.add("active");

  hamburgerIcon.src = "../assets/icons/menu-close.svg";
}

/* =====================================================
              CLIQUE NO BOTÃO
===================================================== */

/*
  Sempre que o botão for clicado:

  Se estiver aberta:
      fecha.

  Se estiver fechada:
      abre.
*/
hamburgerBtn.addEventListener("click", () => {

  const sidebarAberta =
    document.body.classList.contains("sidebar-open");

  if (sidebarAberta) {
    closeSidebar();
  } else {
    openSidebar();
  }

});

/* =====================================================
            CLIQUE FORA DA SIDEBAR
===================================================== */

/*
  Se o usuário clicar na área escura
  (overlay), fechamos a sidebar.

  É o mesmo comportamento de um modal.
*/
overlay.addEventListener("click", closeSidebar);

/* =====================================================
              RESPONSIVIDADE
===================================================== */

/*
  Este evento é executado sempre
  que a largura da tela muda.

  Exemplos:
  - girar tablet
  - redimensionar navegador
  - mudar breakpoint
*/
window.addEventListener("resize", () => {

  const larguraTela = window.innerWidth;

  /*
    Se voltar para desktop (>1024)
    ou entrar no mobile (<=768),
    garantimos que a sidebar seja fechada.

    Isso evita bugs visuais.
  */
  if (larguraTela > 1024 || larguraTela <= 768) {

    closeSidebar();

  }

});