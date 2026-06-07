document.addEventListener('DOMContentLoaded', () => {
    // Elemento principal da página inicial
    const btnNovoRelatorio = document.getElementById('btnNovoRelatorio');
    
    // Seleção dos três Modais (dialog)
    const modalTipoRelatorio = document.getElementById('modalTipoRelatorio');
    const modalAtendGeral = document.getElementById('modalAtendGeral');
    const modalAcompPed = document.getElementById('modalAcompPed');

    // Botões de escolha de tipo (dentro do 1º modal)
    const btnAtendGeral = document.getElementById('btnAtendGeral');
    const btnAcompPed = document.getElementById('btnAcompPed');

    // Botões de Voltar (seta esquerda) dos formulários
    const btnVoltarAtend = document.getElementById('btnVoltarAtend');
    const btnVoltarPed = document.getElementById('btnVoltarPed');

   
    // ======== INTERAÇÕES CONDICIONAIS ======== \\

    // clicar em "Novo Relatório" abre o modal de escolha

    if (btnNovoRelatorio) {
        btnNovoRelatorio.addEventListener('click', () => {
            modalTipoRelatorio.showModal();
        });
    }

    // escolher "Atend. Geral" (fecha o primeiro modal e abre o formulário de acordo com a escolha)

    if (btnAtendGeral) {
        btnAtendGeral.addEventListener('click', () => {
            modalTipoRelatorio.close();
            modalAtendGeral.showModal();
        });
    }

    // escolher "Acomp. Psicológico" (fecha o primeiro modal e abre o formulário correspondente)
    if (btnAcompPed) {
        btnAcompPed.addEventListener('click', () => {
            modalTipoRelatorio.close();
            modalAcompPed.showModal();
        });
    }

    // seta voltar do Atendimento Geral (Retorna para a tela de seleção)
    if (btnVoltarAtend) {
        btnVoltarAtend.addEventListener('click', () => {
            modalAtendGeral.close();
            modalTipoRelatorio.showModal();
        });
    }

    // seta voltar do Acompanhamento Psicológico (volta para a tela de seleção)
    if (btnVoltarPed) {
        btnVoltarPed.addEventListener('click', () => {
            modalAcompPed.close();
            modalTipoRelatorio.showModal();
        });
    }
});


// ========== LÓGICA DE SELEÇÃO DE CURSOS ========== //


const cursos = {
  tecnico: [
    "Técnico de/em Eletromecânica",
    "Técnico em Administração",
    "Técnico em Automação / Automação Industrial",
    "Técnico em Desenvolvimento de Sistemas / Sistema",
    "Técnico em Edificações",
    "Técnico em Eletrotécnica",
    "Técnico em Informática / Informática para Internet",
    "Técnico em Logística",
    "Técnico em Manutenção Automotiva / Automotiva",
    "Técnico em Planejamento e Controle da Produção / EAD",
    "Técnico em Qualidade",
    "Técnico em Segurança do Trabalho"
  ],

  qualificacao: [
    "Agente de Gestão de Resíduos Sólidos Industriais e Urbanos",
    "Almoxarife",
    "Aperfeiçoamento em Caldeiraria Industrial",
    "Assistente Administrativo / Assistente ADM",
    "Assistente de Logística",
    "Assistente de Produção",
    "Auxiliar de Linha de Produção Para a Indústria de Pneus",
    "Auxiliar de Produção",
    "Controlador Lógico Programável",
    "Eletricista Industrial",
    "Funileiro Automotivo",
    "Instalação e Manutenção de Condicionadores Ar Split System",
    "Instalação, Operação e Manutenção em Carregadores de Veículos Elétricos",
    "Mecânico de Manutenção de Máquinas Industriais",
    "Montador de Andaimes / Andaime",
    "Operação de Empilhadeira Elétrica",
    "Operador de Microcomputador e Informática",
    "Operador de Processos Industriais",
    "Operador de Produção Veicular",
    "Pintura",
    "Planejamento e Controle da Produção",
    "Segurança em Eletricidade – NR 10 – Básico",
    "Ser Jovem",
    "Soldador por Eletrodo Revestido de Estruturas e Tubulações",
    "Soldagem MIG/MAG de Estruturas Metálicas"
  ],

  programas: [
    "BYD",
    "LauroQualifica",
    "TI"
  ]
};

// pega TODOS os selects tipoCurso
const tiposCurso = document.querySelectorAll(".tipoCurso");

tiposCurso.forEach(function(tipoCurso) {

  tipoCurso.addEventListener("change", function () {

    const tipoSelecionado = this.value;

    // pega o select CURSO que está no MESMO modal/grupo
    const campoCurso = this.parentElement.querySelector(".curso");

    // limpa opções antigas
    campoCurso.innerHTML = "";

    // opção padrão
    const optionPadrao = document.createElement("option");

    optionPadrao.value = "";
    optionPadrao.textContent = "CURSO";

    campoCurso.appendChild(optionPadrao);

    // se nada selecionado
    if (!tipoSelecionado) return;

    // adiciona cursos
    cursos[tipoSelecionado].forEach(function(nomeCurso) {

      const option = document.createElement("option");

      option.value = nomeCurso;
      option.textContent = nomeCurso;

      campoCurso.appendChild(option);

    });

  });

});