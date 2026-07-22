document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. CAPTURA DE ELEMENTOS DO DOM
  // ==========================================================================
  const btnNovoRelatorio = document.getElementById("btnNovoRelatorio");

  const modalTipoRelatorio = document.getElementById("modalTipoRelatorio");
  const modalAtendGeral = document.getElementById("modalAtendGeral");
  const modalAcompPed = document.getElementById("modalAcompPed");

  const btnAtendGeral = document.getElementById("btnAtendGeral");
  const btnAcompPed = document.getElementById("btnAcompPed");

  const btnVoltarAtend = document.getElementById("btnVoltarAtend");
  const btnVoltarPed = document.getElementById("btnVoltarPed");

  const formAtendGeral = modalAtendGeral ? modalAtendGeral.querySelector("form") : null;
  const formAcompPed = modalAcompPed ? modalAcompPed.querySelector("form") : null;

  const btnSalvarAtendGeral = modalAtendGeral ? modalAtendGeral.querySelector(".btn-salvarAtendimento") : null;
  const btnSalvarPed = modalAcompPed ? modalAcompPed.querySelector(".btn-salvarAtendimento") : null;

  // ==========================================================================
  // 2. INTERAÇÕES CONDICIONAIS (FLUXO DE NAVEGAÇÃO DOS MODAIS)
  // ==========================================================================
  if (btnNovoRelatorio) {

      btnNovoRelatorio.addEventListener("click", () => {
        modalTipoRelatorio.showModal();
    });

  }

  if (btnAtendGeral) {
    btnAtendGeral.addEventListener("click", () => {
      modalTipoRelatorio.close();
      modalAtendGeral.showModal();
    });
  }

  if (btnAcompPed) {
    btnAcompPed.addEventListener("click", () => {
      modalTipoRelatorio.close();
      modalAcompPed.showModal();
    });
  }

  if (btnVoltarAtend) {
    btnVoltarAtend.addEventListener("click", () => {
      modalAtendGeral.close();
      modalTipoRelatorio.showModal();
    });
  }

  if (btnVoltarPed) {
    btnVoltarPed.addEventListener("click", () => {
      modalAcompPed.close();
      modalTipoRelatorio.showModal();
    });
  }

});

// ==========================================================================
// LÓGICA DE SELEÇÃO DE CURSOS
// ==========================================================================
const cursos = {
  tecnico: [
    "Técnico de/em Eletromecânica", "Técnico em Administração", "Técnico em Automação / Automação Industrial",
    "Técnico em Desenvolvimento de Sistemas / Sistema", "Técnico em Edificações", "Técnico em Eletrotécnica",
    "Técnico em Informática / Informática para Internet", "Técnico em Logística", "Técnico em Manutenção Automotiva / Automotiva",
    "Técnico em Planejamento e Controle da Produção / EAD", "Técnico em Qualidade", "Técnico em Segurança do Trabalho",
  ],
  curso_de_qualificacao_aperfeiçoamento_extensão: [
    "Agente de Gestão de Resíduos Sólidos Industriais e Urbanos", "Almoxarife", "Aperfeiçoamento em Caldeiraria Industrial",
    "Assistente Administrativo / Assistente ADM", "Assistente de Logística", "Assistente de Production",
    "Auxiliar de Linha de Produção Para a Indústria de Pneus", "Auxiliar de Produção", "Controlador Lógico Programável",
    "Eletricista Industrial", "Funileiro Automotivo", "Instalação e Manutenção de Condicionadores Ar Split System",
    "Instalação, Operação e Manutenção em Carregadores de Veículos Elétricos", "Mecânico de Manutenção de Máquinas Industriais",
    "Montador de Andaimes / Andaime", "Operação de Empilhadeira Elétrica", "Operador de Microcomputador e Informática",
    "Operador de Processos Industriais", "Operador de Produção Veicular", "Pintura", "Planejamento e Controle da Produção",
    "Segurança em Eletricidade – NR 10 – Básico", "Ser Jovem", "Soldador por Eletrodo Revestido de Estruturas e Tubulações",
    "Soldagem MIG/MAG de Estruturas Metálicas",
  ],
  programas: ["BYD", "LauroQualifica", "TI"],
};

function formatarParaEnum(texto) {
  return texto
    .normalize("NFD") // Separa os acentos das letras
    .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
    .replace(/[^a-zA-Z0-9]/g, "_") // Substitui espaços e símbolos por underline
    .replace(/_+/g, "_") // Garante que não fiquem dois underlines seguidos (ex: " / ")
    .replace(/^_|_$/g, "") // Remove underlines que fiquem sobrando no começo ou fim
    .toLowerCase(); // Converte para minúsculo
}

const tiposCurso = document.querySelectorAll(".tipoCurso");

tiposCurso.forEach(function (tipoCurso) {
  tipoCurso.addEventListener("change", function () {
    const tipoSelecionado = this.value;
    const campoCurso = this.parentElement.querySelector(".curso");

    if (!campoCurso) return;
    campoCurso.innerHTML = "";

    const optionPadrao = document.createElement("option");
    optionPadrao.value = "";
    optionPadrao.textContent = "CURSO";
    campoCurso.appendChild(optionPadrao);

    if (!tipoSelecionado || !cursos[tipoSelecionado]) return;

    cursos[tipoSelecionado].forEach(function (nomeCurso) {
      const option = document.createElement("option");
      option.value = formatarParaEnum(nomeCurso);
      option.textContent = nomeCurso;
      campoCurso.appendChild(option);
    });
  });
});