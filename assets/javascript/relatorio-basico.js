document.addEventListener("DOMContentLoaded", () => {
  let relatorios = JSON.parse(localStorage.getItem("meusRelatorios")) || [];
  //                                                                   ↑  ↑
  //                                                                  Se não encontrar nenhum relatório salvo, ele começa com um array vazio. Essa variável acima será usada para o registro dos relatórios e pdoer consultá-las depois.

  //-------------------------------------------- VARIÁVEIS PARA NAVEGAÇÃO -----------------------------------------------------------------------------------------------------------------------------------\\

  // Elemento principal da página inicial
  const btnNovoRelatorio = document.getElementById("btnNovoRelatorio");

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

  // ======== INTERAÇÕES CONDICIONAIS ======== \\

  // clicar em "Novo Relatório" abre o modal de escolha

  if (btnNovoRelatorio) {
    btnNovoRelatorio.addEventListener("click", () => {
      modalTipoRelatorio.showModal();
    });
  }

  // escolher "Atend. Geral" (fecha o primeiro modal e abre o formulário de acordo com a escolha)

  if (btnAtendGeral) {
    btnAtendGeral.addEventListener("click", () => {
      modalTipoRelatorio.close();
      modalAtendGeral.showModal();
    });
  }

  // escolher "Acomp. Pedalógico" (fecha o primeiro modal e abre o formulário correspondente)
  if (btnAcompPed) {
    btnAcompPed.addEventListener("click", () => {
      modalTipoRelatorio.close();
      modalAcompPed.showModal();
    });
  }

  // seta voltar do Atendimento Geral (Retorna para a tela de seleção)
  if (btnVoltarAtend) {
    btnVoltarAtend.addEventListener("click", () => {
      modalAtendGeral.close();
      modalTipoRelatorio.showModal();
    });
  }

  // seta voltar do Acompanhamento Pedagógico (volta para a tela de seleção)
  if (btnVoltarPed) {
    btnVoltarPed.addEventListener("click", () => {
      modalAcompPed.close();
      modalTipoRelatorio.showModal();
    });
  }
});
//---------------------------------------------------------------- LÓGICA DE SELEÇÃO DE CURSOS ----------------------------------------------------------------------------\\

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

// pega TODOS os selects tipoCurso
const tiposCurso = document.querySelectorAll(".tipoCurso");

tiposCurso.forEach(function (tipoCurso) {
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
    cursos[tipoSelecionado].forEach(function (nomeCurso) {
      const option = document.createElement("option");

      option.value = nomeCurso;
      option.textContent = nomeCurso;

      campoCurso.appendChild(option);
    });
  });
});

//------------------------------------------------------ FUNCIONALIDADE: SALVAMENTO, EXIBIÇÃO E  DOS RELATÓRIOS ---------------------------------------------------------------------\\

// ============ I. - Salvando: ============== \\

// Capturando os modais acionados pelos dois botões \\
const formAtendGeral = modalAtendGeral.querySelector("form");
const formAcompPed = modalAcompPed.querySelector("form");

// Capturando os botões submit de cada tipo de formulário: \\
const btnSalvarAtendGeral = document.querySelector("btn-salvarAtendimento");
const btnSalvarPed = document.querySelector("btn-salvarAtendimento");

//-------------------------------------------- FUNÇÕES ----------------------------------------------------------------------\\

// Função genérica para processar e salvar os dados de qualquer um dos formulários
function salvarFormulario(formulario, tipoRelatorio, modal) {
  // Cria o objeto FormData que lê os atributos 'name' automaticamente
  const formData = new FormData(formulario);
  const dadosRelatorio = Object.fromEntries(formData.entries());

  // Insere metadados importantes: ID único (timestamp) e o Tipo do relatório
  dadosRelatorio.id = Date.now();
  dadosRelatorio.tipoRelatorio = tipoRelatorio;

  // Adiciona o novo relatório na nossa lista global
  relatorios.push(dadosRelatorio);

  // Atualiza o banco localStorage transformando a lista em texto puro
  localStorage.setItem("meusRelatorios", JSON.stringify(relatorios));

  // Reseta o formulário (limpa os campos de texto e selects)
  formulario.reset();

  // Fecha o modal atual
  modal.close();

  // Atualiza a tela exibindo o novo card
  renderizarRelatorios();
}

// Evento do botão Salvar do Atendimento Geral
if (btnSalvarAtend) {
  btnSalvarAtend.addEventListener("click", (e) => {
    e.preventDefault(); // Evita qualquer comportamento estranho do modal
    salvarFormulario(formAtendGeral, "Atendimento Geral", modalAtendGeral);
  });
}

// Evento do botão Salvar do Acompanhamento Pedagógico
if (btnSalvarPed) {
  btnSalvarPed.addEventListener("click", (e) => {
    e.preventDefault();
    salvarFormulario(formAcompPed, "Acompanhamento Pedagógico", modalAcompPed);
  });
}

//-------------------------------EXIBINDO------------------------------------------\\

relatorios.forEach((rel) => {
  // 1. Cria a estrutura principal do card
  const card = document.createElement("div");
  card.className = "card-relatorio";

  // 2. Cria o Header do Card
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

  // 3. Cria o Body do Card
  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const pTurma = document.createElement("p");
  pTurma.innerHTML =
    "<strong>Turma:</strong> " + (rel.turma || "Não informada");

  const pCurso = document.createElement("p");
  pCurso.innerHTML =
    "<strong>Curso:</strong> " + (rel.curso || "Não informado");

  // Formata a data (de AAAA-MM-DD para DD/MM/AAAA)
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

  // 4. Cria o Footer com o botão de deletar
  const cardFooter = document.createElement("div");
  cardFooter.className = "card-footer";

  const btnDeletar = document.createElement("button");
  btnDeletar.className = "btn-deletar";
  btnDeletar.textContent = "Excluir";
  // Adiciona o ID no atributo de dados sem usar $
  btnDeletar.setAttribute("data-id", rel.id);

  cardFooter.appendChild(btnDeletar);

  // 5. Junta tudo dentro do Card principal
  card.appendChild(cardHeader);
  card.appendChild(cardBody);
  card.appendChild(cardFooter);

  // 6. Coloca o card pronto dentro do container da tela
  containerRelatorios.appendChild(card);
});
