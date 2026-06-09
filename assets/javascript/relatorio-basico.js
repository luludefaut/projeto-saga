document.addEventListener("DOMContentLoaded", () => {
  // Inicialização do Banco Local (Recupera os dados ou cria um array vazio se for o primeiro acesso)
  let relatorios = JSON.parse(localStorage.getItem("meusRelatorios")) || [];

  // ==========================================================================
  // 1. CAPTURA DE ELEMENTOS DO DOM (VARIÁVEIS DE ELEMENTO)
  // ==========================================================================
  const btnNovoRelatorio = document.getElementById("btnNovoRelatorio");
  const containerRelatorios = document.getElementById("containerRelatorios");
  const emptyState = document.querySelector(".empty-state-container");

  // Seleção dos três modais (dialog)
  const modalTipoRelatorio = document.getElementById("modalTipoRelatorio");
  const modalAtendGeral = document.getElementById("modalAtendGeral");
  const modalAcompPed = document.getElementById("modalAcompPed");

  // Botões de escolha de tipo (dentro do 1º modal)
  const btnAtendGeral = document.getElementById("btnAtendGeral");
  const btnAcompPed = document.getElementById("btnAcompPed");

  // Botões de Voltar (seta esquerda) dos formulários
  const btnVoltarAtend = document.getElementById("btnVoltarAtend");
  const btnVoltarPed = document.getElementById("btnVoltarPed");

  // Capturando os formulários internos de cada modal
  const formAtendGeral = modalAtendGeral
    ? modalAtendGeral.querySelector("form")
    : null;
  const formAcompPed = modalAcompPed
    ? modalAcompPed.querySelector("form")
    : null;

  // Capturando os botões salvar ESPECÍFICOS usando o escopo do próprio modal (Corrigido com o '.')
  const btnSalvarAtendGeral = modalAtendGeral
    ? modalAtendGeral.querySelector(".btn-salvarAtendimento")
    : null;
  const btnSalvarPed = modalAcompPed
    ? modalAcompPed.querySelector(".btn-salvarAtendimento")
    : null;

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

  // ==========================================================================
  // 3. FUNÇÕES PRINCIPAIS (SALVAMENTO E EXIBIÇÃO)
  // ==========================================================================

  // Função genérica para processar e salvar os dados de qualquer um dos formulários
  function salvarFormulario(formulario, tipoRelatorio, modal) {
    if (!formulario) return;

    // Cria o objeto FormData que mapeia os inputs pelos atributos 'name'
    const formData = new FormData(formulario);
    const dadosRelatorio = Object.fromEntries(formData.entries());

    // Insere metadados essenciais
    dadosRelatorio.id = Date.now(); // ID único gerado por timestamp
    dadosRelatorio.tipoRelatorio = tipoRelatorio;

    // Alimenta a nossa lista global na memória
    relatorios.push(dadosRelatorio);

    // Atualiza de fato o banco de dados local do navegador
    localStorage.setItem("meusRelatorios", JSON.stringify(relatorios));

    // Reseta o formulário, fecha a janela popup e redesenha a tela atualizada
    formulario.reset();
    modal.close();
    renderizarRelatorios();
  }

  // Evento do botão Salvar do Atendimento Geral
  if (btnSalvarAtendGeral) {
    btnSalvarAtendGeral.addEventListener("click", (e) => {
      e.preventDefault(); // Impede o recarregamento da página!
      salvarFormulario(formAtendGeral, "Atendimento Geral", modalAtendGeral);
    });
  }

  // Evento do botão Salvar do Acompanhamento Pedagógico
  if (btnSalvarPed) {
    btnSalvarPed.addEventListener("click", (e) => {
      e.preventDefault(); // Impede o recarregamento da página!
      salvarFormulario(
        formAcompPed,
        "Acompanhamento Pedagógico",
        modalAcompPed
      );
    });
  }

  // Função dinâmica para criar e exibir os cards na tela
  function renderizarRelatorios() {
    if (!containerRelatorios) return;

    // Limpa o container para não duplicar os dados anteriores
    containerRelatorios.innerHTML = "";

    // Controla o estado vazio (Se não tiver dados, mostra o alerta de aviso)
    if (relatorios.length === 0) {
      if (emptyState) emptyState.style.display = "flex";
      return;
    }
    if (emptyState) emptyState.style.display = "none";

    // Mapeia o array e constrói dinamicamente a estrutura de cada card usando manipulação de DOM limpa
    relatorios.forEach((rel) => {
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
      statusTag.textContent = rel.status
        ? rel.status.toUpperCase()
        : "EM ANDAMENTO";

      cardHeader.appendChild(titulo);
      cardHeader.appendChild(statusTag);

      // 3. Corpo do Card (Dados consolidados)
      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const pTurma = document.createElement("p");
      pTurma.innerHTML =
        "<strong>Turma:</strong> " + (rel.turma || "Não informada");

      const pCurso = document.createElement("p");
      pCurso.innerHTML =
        "<strong>Curso:</strong> " + (rel.curso || "Não informado");

      // Formatação humana de data (AAAA-MM-DD para DD/MM/AAAA)
      const dataFormatada = rel.data
        ? rel.data.split("-").reverse().join("/")
        : "N/A";
      const pData = document.createElement("p");
      pData.innerHTML = "<strong>Data:</strong> " + dataFormatada;

      const pDescricao = document.createElement("p");
      pDescricao.innerHTML =
        "<strong>Descrição:</strong> " + (rel.descricao || "Sem descrição...");

      cardBody.appendChild(pTurma);
      cardBody.appendChild(pCurso);
      cardBody.appendChild(pData);
      cardBody.appendChild(pDescricao);

      // 4. Rodapé do Card com o botão de remoção
      const cardFooter = document.createElement("div");
      cardFooter.className = "card-footer";

      const btnDeletar = document.createElement("button");
      btnDeletar.className = "btn-deletar";
      btnDeletar.textContent = "Excluir";
      btnDeletar.setAttribute("data-id", rel.id); // Guardamos o ID numérico aqui

      cardFooter.appendChild(btnDeletar);

      // 5. Montagem hierárquica do Card
      card.appendChild(cardHeader);
      card.appendChild(cardBody);
      card.appendChild(cardFooter);

      // Injeta o elemento pronto dentro da Grid de exibição
      containerRelatorios.appendChild(card);
    });
  }

  // Execução inicial automática ao abrir a página
  renderizarRelatorios();
});

// ==========================================================================
// LÓGICA DE SELEÇÃO DE CURSOS (MANTIDA INDEPENDENTE, FORA DO DOM PRINCIPAL)
// ==========================================================================
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
    "Técnico em Segurança do Trabalho",
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
    "Soldagem MIG/MAG de Estruturas Metálicas",
  ],
  programas: ["BYD", "LauroQualifica", "TI"],
};

const tiposCurso = document.querySelectorAll(".tipoCurso");

tiposCurso.forEach(function (tipoCurso) {
  tipoCurso.addEventListener("change", function () {
    const tipoSelecionado = this.value;
    const campoCurso = this.parentElement.querySelector(".curso");

    campoCurso.innerHTML = "";

    const optionPadrao = document.createElement("option");
    optionPadrao.value = "";
    optionPadrao.textContent = "CURSO";
    campoCurso.appendChild(optionPadrao);

    if (!tipoSelecionado) return;

    cursos[tipoSelecionado].forEach(function (nomeCurso) {
      const option = document.createElement("option");
      option.value = nomeCurso;
      option.textContent = nomeCurso;
      campoCurso.appendChild(option);
    });
  });
});
