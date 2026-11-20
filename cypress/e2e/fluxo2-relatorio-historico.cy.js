import { visitarLogado } from "../support/helpers";

const API = "http://localhost:3000";
const MODAL = "#modalAtendGeral"; // modal do formulário "Atendimento Geral"

// Relatório finalizado já pronto (usado nos testes do Histórico).
// data_conclusao = agora, para o botão de editar (regra das 24h) aparecer.
function registroFinalizado() {
  return {
    id_registro_pk: 1,
    tipo_relatorio: "atendimento_geral",
    turno: "manha",
    modalidade: "presencial",
    data_inicial: "2026-11-10",
    turma: "TDS-101",
    id_curso_fk: 4,
    data_encerramento: "2026-11-15",
    tipo_atendimento: "acolhimento",
    status_registro: "finalizado",
    pedagogo: "Maria Souza",
    instrutor_aluno: "João Lima",
    coordenacao: "Carlos Dias",
    tratativa_nep: "Conversa realizada",
    descricao: "Descrição original do relatório",
    data_conclusao: new Date().toISOString(),
  };
}

// Preenche SÓ os campos obrigatórios (data, pedagogo e status)
function preencherObrigatorios(status) {
  cy.get(`${MODAL} [name="data_inicial"]`).type("2026-11-10");
  cy.get(`${MODAL} [name="pedagogo"]`).type("Maria Souza");
  cy.get(`${MODAL} [name="status_registro"]`).select(status);
}

// Preenche TODOS os campos (necessário para finalizar um relatório)
function preencherTudo(status) {
  cy.get(`${MODAL} [name="turno"]`).select("manha");
  cy.get(`${MODAL} [name="modalidade"]`).select("presencial");
  cy.get(`${MODAL} [name="data_inicial"]`).type("2026-11-10");
  cy.get(`${MODAL} [name="turma"]`).type("TDS-101");
  cy.get(`${MODAL} [name="tipo_curso"]`).select("tecnico");
  cy.get(`${MODAL} [name="id_curso_fk"]`).select("4"); // Téc. Desenvolvimento de Sistemas
  cy.get(`${MODAL} [name="data_encerramento"]`).type("2026-11-15");
  cy.get(`${MODAL} [name="tipo_atendimento"]`).select("acolhimento");
  cy.get(`${MODAL} [name="status_registro"]`).select(status);
  cy.get(`${MODAL} [name="pedagogo"]`).type("Maria Souza");
  cy.get(`${MODAL} [name="instrutor_aluno"]`).type("João Lima");
  cy.get(`${MODAL} [name="coordenacao"]`).type("Carlos Dias");
  cy.get(`${MODAL} [name="tratativa_nep"]`).type("Conversa realizada");
  cy.get(`${MODAL} [name="descricao"]`).type("Descrição original do relatório");
}

// Abre o modal de novo relatório até o formulário de Atendimento Geral
function abrirFormularioAtendimentoGeral() {
  cy.get("#btnNovoRelatorio").click();
  cy.get("#btnAtendGeral").click();
  cy.get(MODAL).should("be.visible");
}

describe("Fluxo 2 - Ciclo de vida do relatório", () => {
  // "Banco de dados de mentira": guarda os relatórios enquanto o teste roda
  let registros;

  beforeEach(() => {
    registros = [];

    // Lista de relatórios (usada pelas telas Relatório e Histórico)
    cy.intercept("GET", `${API}/dashboard/registro_pedagogico*`, (req) => {
      req.reply({ statusCode: 200, body: { dados: registros } });
    });

    // Criar relatório: guarda na lista e devolve o id
    cy.intercept("POST", `${API}/relatorio/registro_pedagogico`, (req) => {
      const novo = { ...req.body, id_registro_pk: 10 + registros.length };
      registros.push(novo);
      req.reply({ statusCode: 201, body: novo });
    }).as("criar");

    // Atualizar relatório (usado ao finalizar): altera o que já existe
    cy.intercept("PATCH", `${API}/relatorio/registro_pedagogico/*`, (req) => {
      const id = Number(req.url.split("/").pop());
      const registro = registros.find((r) => r.id_registro_pk === id);

      Object.assign(registro, req.body);

      if (req.body.status_registro === "finalizado") {
        registro.data_conclusao = new Date().toISOString();
      }

      req.reply({ statusCode: 200, body: registro });
    }).as("finalizar");
  });

  it("F2-01/02: mostra a tela vazia e abre a escolha do tipo de relatório", () => {
    visitarLogado("/pages/relatorio.html");

    cy.get("#estadoVazio").should("be.visible");

    cy.get("#btnNovoRelatorio").click();
    cy.get("#modalTipoRelatorio").should("be.visible");
    cy.get("#btnAtendGeral").should("be.visible");
    cy.get("#btnAcompPed").should("be.visible");
  });

  it("F2-03: não salva o relatório com campos obrigatórios vazios", () => {
    visitarLogado("/pages/relatorio.html");

    abrirFormularioAtendimentoGeral();
    cy.get(`${MODAL} .btn-salvarAtendimento`).click();

    cy.get(`${MODAL} .msg-erro`).should("contain", "Preencha os campos obrigatórios");
    cy.get("@criar.all").should("have.length", 0); // nada foi enviado
  });

  it("F2-04: cria um relatório em andamento e ele aparece na lista", () => {
    visitarLogado("/pages/relatorio.html");

    abrirFormularioAtendimentoGeral();
    preencherObrigatorios("andamento");
    cy.get(`${MODAL} [name="turma"]`).type("TDS-101");
    cy.get(`${MODAL} .btn-salvarAtendimento`).click();

    // O front enviou os dados certos?
    cy.wait("@criar").its("request.body").should("include", {
      tipo_relatorio: "atendimento_geral",
      data_inicial: "2026-11-10",
      pedagogo: "Maria Souza",
      status_registro: "andamento",
      turma: "TDS-101",
    });

    cy.get(".toast.sucesso").should("contain", "Relatório salvo com sucesso!");

    // Modal fechou e o card apareceu na lista
    cy.get(MODAL).should("not.be.visible");
    cy.get("#estadoVazio").should("not.be.visible");
    cy.get(".card-relatorio").should("have.length", 1);
    cy.get(".card-relatorio")
      .should("contain", "Atendimento Geral")
      .and("contain", "TDS-101")
      .and("contain", "10/11/2026");
  });

  it("F2-05/06: finaliza um relatório (POST + PATCH) e ele vai para o Histórico", () => {
    visitarLogado("/pages/relatorio.html");

    abrirFormularioAtendimentoGeral();
    preencherTudo("finalizado");
    cy.get(`${MODAL} .btn-salvarAtendimento`).click();

    // A API só cria como "andamento"...
    cy.wait("@criar").its("request.body").should("include", {
      status_registro: "andamento",
      tipo_relatorio: "atendimento_geral",
      id_curso_fk: 4,
    });

    // ...e logo depois o front atualiza para "finalizado"
    cy.wait("@finalizar").its("request.body").should("deep.equal", {
      status_registro: "finalizado",
    });

    cy.get(".toast.sucesso").should(
      "contain",
      "Relatório finalizado e enviado para o Histórico!"
    );

    // Saiu da tela Relatório
    cy.get(".card-relatorio").should("not.exist");
    cy.get("#estadoVazio").should("be.visible");

    // E apareceu no Histórico
    visitarLogado("/pages/historico.html");

    cy.get(".accordion-item").should("have.length", 1);
    cy.get(".accordion-item")
      .should("contain", "Atendimento Geral")
      .and("contain", "Finalizado")
      .and("contain", "Encerrado em 15/11/2026");
  });

  it("F2-07: edita um relatório no Histórico", () => {
    registros = [registroFinalizado()];

    cy.intercept("PATCH", `${API}/historico/registro_pedagogico/*`, {
      statusCode: 200,
      body: {},
    }).as("editar");

    visitarLogado("/pages/historico.html");

    cy.get(".accordion-header").click();
    cy.contains("button", "Editar Relatório").click();

    // O modal abre já preenchido com os dados do relatório
    cy.get(MODAL).should("be.visible");
    cy.get(`${MODAL} [name="descricao"]`).should("have.value", "Descrição original do relatório");

    cy.get(`${MODAL} [name="descricao"]`).clear().type("Descrição alterada no teste");
    cy.get(`${MODAL} .btn-salvarAtendimento`).click();

    cy.wait("@editar").its("request.body").should("include", {
      tipo_relatorio: "atendimento_geral",
      descricao: "Descrição alterada no teste",
    });

    cy.get(".toast.sucesso").should("contain", "Relatório atualizado com sucesso!");
    cy.get(MODAL).should("not.be.visible");
  });

  it("F2-08: exclui e DESFAZ - nada é apagado na API", () => {
    registros = [registroFinalizado()];

    cy.intercept("DELETE", `${API}/historico/registro_pedagogico/*`, {
      statusCode: 204,
    }).as("excluir");

    // Controla só os temporizadores, para não esperar os 6 segundos de verdade
    cy.clock(Date.now(), ["setTimeout", "clearTimeout"]);
    visitarLogado("/pages/historico.html");

    cy.get(".accordion-header").click();
    cy.contains("button", "Excluir Relatório").click();
    cy.get("#btnConfirmarExclusao").click();

    // Some da tela e aparece a barra com "Desfazer"
    cy.get(".accordion-item").should("not.be.visible");
    cy.get("#barraDesfazer").should("contain", "Relatório excluído");

    cy.contains("#barraDesfazer button", "Desfazer").click();

    // O relatório volta e a barra some
    cy.get(".accordion-item").should("be.visible");
    cy.get("#barraDesfazer").should("not.exist");

    // Mesmo passando o tempo, o DELETE nunca é enviado
    cy.tick(7000);
    cy.get("@excluir.all").should("have.length", 0);
  });

  it("F2-09: exclui e CONFIRMA - o DELETE é enviado depois de 6 segundos", () => {
    registros = [registroFinalizado()];

    cy.intercept("DELETE", `${API}/historico/registro_pedagogico/*`, {
      statusCode: 204,
    }).as("excluir");

    cy.clock(Date.now(), ["setTimeout", "clearTimeout"]);
    visitarLogado("/pages/historico.html");

    cy.get(".accordion-header").click();
    cy.contains("button", "Excluir Relatório").click();
    cy.get("#btnConfirmarExclusao").click();

    // Antes dos 6 segundos ainda não foi enviado
    cy.get("@excluir.all").should("have.length", 0);

    cy.tick(6000); // avança o relógio

    cy.wait("@excluir").its("request.url").should("include", "/historico/registro_pedagogico/1");

    cy.get(".accordion-item").should("not.exist");
    cy.get("#historicoVazio").should("be.visible");
  });

  it("F2-10: mostra o erro dentro do modal quando a API falha (500)", () => {
    cy.intercept("POST", `${API}/relatorio/registro_pedagogico`, {
      statusCode: 500,
      body: { message: "erro" },
    }).as("criarComErro");

    visitarLogado("/pages/relatorio.html");

    abrirFormularioAtendimentoGeral();
    preencherObrigatorios("andamento");
    cy.get(`${MODAL} .btn-salvarAtendimento`).click();

    cy.wait("@criarComErro");

    cy.get(`${MODAL} .msg-erro`).should(
      "contain",
      "Erro interno no servidor. Tente novamente mais tarde."
    );
    cy.get(MODAL).should("be.visible"); // o modal continua aberto
  });
});