document.addEventListener("DOMContentLoaded", () => {
  // Inicialização do Banco Local
  let relatorios = JSON.parse(localStorage.getItem("meusRelatorios")) || [];

  // VARIÁVEL DE CONTROLE: Armazena o ID do relatório que está sendo editado (null se for um novo)
  let idRelatorioSendoEditado = null;

  // ==========================================================================
  // 1. CAPTURA DE ELEMENTOS DO DOM
  // ==========================================================================
  const btnNovoRelatorio = document.getElementById("btnNovoRelatorio");
  const containerRelatorios = document.getElementById("containerRelatorios");
  const emptyState = document.querySelector(".empty-state-container");

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
      idRelatorioSendoEditado = null; // Garante que estamos criando um NOVO
      if (formAtendGeral) formAtendGeral.reset();
      if (formAcompPed) formAcompPed.reset();
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

  // ==========================================================================
  // 3. FUNÇÕES PRINCIPAIS (SALVAMENTO, EDIÇÃO E EXIBIÇÃO)
  // ==========================================================================

  function relatorioCompleto(rel) {

    const camposObrigatorios = [
      "turno",
      "modalidade",
      "data",
      "turma",
      "tipoCurso",
      "curso",
      "status",
      "instrutor_aluno",
      "coordenacao",
      "pedagogo",
      "descricao"
    ];

    return camposObrigatorios.every(campo => {
      return (
        rel[campo] &&
        rel[campo].trim() !== ""
      );
    });

  }

  // Função genérica para preencher o formulário na hora de editar
  function preencherFormulario(formulario, dados) {
    if (!formulario) return;

    // Varre todos os campos do formulário pelo atributo 'name'
    Object.keys(dados).forEach(key => {
      const campo = formulario.elements[key];
      if (campo) {
        campo.value = dados[key];

        // Se for o campo de tipo de curso, dispara o evento 'change' manualmente para atualizar os cursos
        if (key === 'tipoCurso') {
          campo.dispatchEvent(new Event('change'));
        }
      }
    });

    // Pequeno delay necessário para o campo curso (select dinâmico) conseguir carregar e receber o valor antigo
    setTimeout(() => {
      if (formulario.elements['curso']) {
        formulario.elements['curso'].value = dados['curso'] || "";
      }
    }, 50);
  }

  // Função genérica para processar, salvar ou atualizar os dados
  function salvarFormulario(formulario, tipoRelatorio, modal) {
    if (!formulario) return;

    const formData = new FormData(formulario);
    const dadosRelatorio = Object.fromEntries(formData.entries());

    if (
      dadosRelatorio.status === "finalizado" &&
      !relatorioCompleto(dadosRelatorio)
    ) {

      alert(
        "Para finalizar o relatório é necessário preencher todos os campos obrigatórios."
      );

      return;
    }

    if (idRelatorioSendoEditado !== null) {
      // MODO EDIÇÃO: Localiza o relatório antigo pelo ID e atualiza os dados dele
      const index = relatorios.findIndex(rel => rel.id === idRelatorioSendoEditado);
      if (index !== -1) {
        // Mantém o ID e o Tipo original, atualizando o resto do formulário
        dadosRelatorio.id = idRelatorioSendoEditado;
        dadosRelatorio.tipoRelatorio = tipoRelatorio;
        relatorios[index] = dadosRelatorio;
      }
    } else {
      // MODO NOVO: Cria um novo registro com ID único baseado em timestamp
      dadosRelatorio.id = Date.now();
      dadosRelatorio.tipoRelatorio = tipoRelatorio;
      dadosRelatorio.dataCriacao = new Date().toISOString();
      relatorios.push(dadosRelatorio);
    }

    // Atualiza o localStorage
    localStorage.setItem("meusRelatorios", JSON.stringify(relatorios));

    // Reseta o estado global e fecha as janelas
    idRelatorioSendoEditado = null;
    formulario.reset();
    modal.close();
    renderizarRelatorios();
  }

  // Eventos dos botões Salvar
  if (btnSalvarAtendGeral) {
    btnSalvarAtendGeral.addEventListener("click", (e) => {
      e.preventDefault();
      salvarFormulario(formAtendGeral, "Atendimento Geral", modalAtendGeral);
    });
  }

  if (btnSalvarPed) {
    btnSalvarPed.addEventListener("click", (e) => {
      e.preventDefault();
      salvarFormulario(formAcompPed, "Acompanhamento Pedagógico", modalAcompPed);
    });
  }

  // Função dinâmica para criar e exibir os cards na tela
  function renderizarRelatorios() {
    if (!containerRelatorios) return;

    containerRelatorios.innerHTML = "";

    if (relatorios.length === 0) {
      if (emptyState) emptyState.style.display = "flex";
      return;
    }
    if (emptyState) emptyState.style.display = "none";

    const relatoriosAtivos = relatorios.filter(rel => {

      return (
        rel.status === "pendente" ||
        rel.status === "andamento"
      );

    });

    relatoriosAtivos.forEach((rel) => {
      // 1. Estrutura externa
      const card = document.createElement("div");
      card.className = "card-relatorio";

      // 2. Cabeçalho do Card
      const cardHeader = document.createElement("div");
      cardHeader.className = "card-header";

      const titulo = document.createElement("h3");
      titulo.textContent = rel.tipoRelatorio;

      const statusTag = document.createElement("span");
      const statusClass = rel.status ? rel.status.toLowerCase() : "andamento";
      statusTag.className = "status-tag " + statusClass;
      statusTag.textContent = rel.status ? rel.status.toUpperCase() : "EM ANDAMENTO";

      cardHeader.appendChild(titulo);
      cardHeader.appendChild(statusTag);

      // 3. Corpo do Card (Dados consolidados)
      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const pTurma = document.createElement("p");
      pTurma.innerHTML = "<strong>Turma:</strong> " + (rel.turma || "Não informada");

      const pCurso = document.createElement("p");
      pCurso.innerHTML = "<strong>Curso:</strong> " + (rel.curso || "Não informado");

      const dataFormatada = rel.data ? rel.data.split("-").reverse().join("/") : "N/A";
      const pData = document.createElement("p");
      pData.innerHTML = "<strong>Data:</strong> " + dataFormatada;

      const pDescricao = document.createElement("p");
      pDescricao.className = "descricao-card";
      pDescricao.innerHTML = "<strong>Descrição:</strong> " + (rel.descricao || "Sem descrição...");

      cardBody.appendChild(pTurma);
      cardBody.appendChild(pCurso);
      cardBody.appendChild(pData);
      cardBody.appendChild(pDescricao);

      // 4. Rodapé do Card (BOTÃO EDITAR)
      const cardFooter = document.createElement("div");
      cardFooter.className = "card-footer";

      const btnEditarCard = document.createElement("button");
      btnEditarCard.className = "btn-editar-card";
      btnEditarCard.innerHTML = `<img src="../assets/icons/editar-icon.svg" alt="Editar"> Editar`;

      // LOGICA DO CLIQUE NO EDITAR DO CARD
      btnEditarCard.addEventListener("click", () => {
        idRelatorioSendoEditado = rel.id; // Salva qual item estamos alterando

        if (rel.tipoRelatorio === "Atendimento Geral") {
          preencherFormulario(formAtendGeral, rel);
          modalAtendGeral.showModal();
        } else if (rel.tipoRelatorio === "Acompanhamento Pedagógico") {
          preencherFormulario(formAcompPed, rel);
          modalAcompPed.showModal();
        }
      });

      cardFooter.appendChild(btnEditarCard);

      // 5. Montagem hierárquica do Card
      card.appendChild(cardHeader);
      card.appendChild(cardBody);
      card.appendChild(cardFooter); // Adiciona o rodapé com o botão

      containerRelatorios.appendChild(card);
    });
  }

  renderizarRelatorios();
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
  qualificacao: [
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
      option.value = nomeCurso;
      option.textContent = nomeCurso;
      campoCurso.appendChild(option);
    });
  });
});
