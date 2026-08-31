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

overlay.addEventListener("click", () => {

  closeSidebar();

});

/* =====================================================
        RELOAD AO TROCAR BREAKPOINT
===================================================== */

function obterBreakpoint() {

  const largura = window.innerWidth;

  if (largura > 1024) return "desktop";

  if (largura > 768) return "tablet";

  if (largura > 480) return "mobile";

  return "mobile-pequeno";
}

let breakpointAtual =
obterBreakpoint();

window.addEventListener("resize", () => {

  const novoBreakpoint =
  obterBreakpoint();

  if (novoBreakpoint !== breakpointAtual) {

    location.reload();

  }

}); 


/* =====================================================
    GERENCIADOR DE TEMAS E ACESSIBILIDADE GLOBAL
===================================================== */

// Executa no instante do carregamento do script para evitar o "piscar" branco
aplicarPreferenciasSalvas();

// Aguarda o HTML carregar para mapear os switches caso esteja na página de configurações
document.addEventListener("DOMContentLoaded", () => {
  inicializarSwitchesConfiguracoes();
});

function aplicarPreferenciasSalvas() {
  const isDarkMode = localStorage.getItem("saga_dark_mode") === "true";
  const isAltoContraste = localStorage.getItem("saga_alto_contraste") === "true";

  document.body.classList.toggle("dark-mode", isDarkMode);
  document.body.classList.toggle("alto-contraste", isAltoContraste);
}

function inicializarSwitchesConfiguracoes() {
  const switchDark = document.getElementById("acess-dark");
  const switchContraste = document.getElementById("acess-cores");

  // Se não estiver na página de configurações, encerra sem causar erro
  if (!switchDark || !switchContraste) return;

  // Sincroniza estado visual dos switches com o localStorage ao abrir a página
  switchDark.checked = localStorage.getItem("saga_dark_mode") === "true";
  switchContraste.checked = localStorage.getItem("saga_alto_contraste") === "true";

  // Evento Dark Mode
  switchDark.addEventListener("change", () => {
    const ativado = switchDark.checked;

    if (ativado) {
      // Se ativou o Dark Mode, desativa o Alto Contraste visual e no storage
      switchContraste.checked = false;
      localStorage.setItem("saga_alto_contraste", "false");
      document.body.classList.remove("alto-contraste");
    }

    // Aplica o Dark Mode
    localStorage.setItem("saga_dark_mode", ativado);
    document.body.classList.toggle("dark-mode", ativado);

    // Envia ambos os estados atualizados para o Banco
    salvarPreferenciasNoBanco();
  });

  // Evento Alto Contraste
  switchContraste.addEventListener("change", () => {
    const ativado = switchContraste.checked;

    if (ativado) {
      // Se ativou o Alto Contraste, desativa o Dark Mode visual e no storage
      switchDark.checked = false;
      localStorage.setItem("saga_dark_mode", "false");
      document.body.classList.remove("dark-mode");
    }

    // Aplica o Alto Contraste
    localStorage.setItem("saga_alto_contraste", ativado);
    document.body.classList.toggle("alto-contraste", ativado);

    // Envia ambos os estados atualizados para o Banco
    salvarPreferenciasNoBanco();
  });
}

/* ==========================================================================
   3. COMUNICAÇÃO COM O BANCO DE DADOS
   ========================================================================== */
// async function salvarPreferenciasNoBanco() {
//   const dadosPreferencias = {
//     preferencia_tema: localStorage.getItem("saga_dark_mode") === "true",
//     preferencia_contraste: localStorage.getItem("saga_alto_contraste") === "true"
//   };

//   try {
//     // Insira a rota da sua API futuramente
//     await fetch("https://sua-api.com/api/usuario/preferencias", {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(dadosPreferencias)
//     });
//   } catch (error) {
//     console.error("Erro ao salvar preferências no banco:", error);
//   }
// }