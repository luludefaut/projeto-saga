import { criarTokenFalso, usuarioFalso, visitarLogado } from "../support/helpers";

const API = "http://localhost:3000";

describe("Fluxo 1 - Autenticação e cadastro de usuário", () => {
  // Depois do login o site abre a tela Relatório, que já pede a lista
  // de relatórios na API. Aqui devolvemos uma lista vazia.
  beforeEach(() => {
    cy.intercept("GET", `${API}/dashboard/registro_pedagogico*`, {
      statusCode: 200,
      body: { dados: [] },
    });
  });

  it("F1-01: faz login com sucesso e vai para a tela Relatório", () => {
    const token = criarTokenFalso();

    cy.intercept("POST", `${API}/auth/login`, {
      statusCode: 200,
      body: { token, usuario: usuarioFalso },
    }).as("login");

    cy.visit("/index.html");
    cy.get("#email").type("saga@email.com");
    cy.get("#senha").type("saga12345");
    cy.get(".loginbtn").click();

    // O front mandou os campos que a API espera?
    cy.wait("@login").its("request.body").should("deep.equal", {
      email_usu: "saga@email.com",
      senha_usu: "saga12345",
      lembrarMe: false,
    });

    cy.url().should("include", "/pages/relatorio.html");

    // O token foi guardado na sessão?
    cy.window().then((win) => {
      expect(win.localStorage.getItem("saga_token")).to.eq(token);
    });
  });

  it("F1-02: mostra os avisos quando o login é enviado vazio", () => {
    cy.intercept("POST", `${API}/auth/login`).as("login");

    cy.visit("/index.html");
    cy.get(".loginbtn").click();

    cy.get("#alertaEmail").should("have.text", "Preencha o campo E-mail!");
    cy.get("#alertaSenha").should("have.text", "Preencha o campo Senha!");

    // Nenhuma chamada à API pode ter sido feita
    cy.get("@login.all").should("have.length", 0);
  });

  it("F1-05: mostra erro e continua no login com credenciais erradas (401)", () => {
    cy.intercept("POST", `${API}/auth/login`, {
      statusCode: 401,
      body: { message: "E-mail ou senha incorretos." },
    }).as("login");

    cy.visit("/index.html");
    cy.get("#email").type("saga@email.com");
    cy.get("#senha").type("senhaerrada1");
    cy.get(".loginbtn").click();

    cy.wait("@login");

    cy.get("#alertaSenha").should("have.text", "E-mail ou senha incorretos.");
    cy.url().should("not.include", "relatorio.html");
  });

  it("F1-06: barra quem tenta abrir uma página interna sem login", () => {
    cy.visit("/pages/relatorio.html");

    cy.url().should("include", "/index.html");
    cy.url().should("not.include", "relatorio");
  });

  it("F1-07: Configurações tem o link para cadastrar novo usuário", () => {
    visitarLogado("/pages/configuracoes.html");

    // O link abre em outra aba (target=_blank), e o Cypress não troca de
    // aba. Por isso conferimos o link e depois visitamos a página direto.
    cy.contains("a", "Cadastrar Novo Usuário")
      .should("have.attr", "href", "../pages/cadastro.html")
      .and("have.attr", "target", "_blank");
  });

  it("F1-08: cadastra um novo usuário com sucesso", () => {
    cy.intercept("POST", `${API}/auth/register`, {
      statusCode: 201,
      body: { message: "Usuário cadastrado" },
    }).as("cadastrar");

    visitarLogado("/pages/cadastro.html");

    // Prepara a "espia" do alert() antes de clicar
    const alerta = cy.stub().as("alerta");
    cy.on("window:alert", alerta);

    cy.get("#nome").type("Daniel Richard");
    cy.get("#email").type("danielSan@saga.com");
    cy.get("#senha").type("senha12345");
    cy.get("#cadastrobtn").click();

    cy.wait("@cadastrar").its("request.body").should("deep.equal", {
        nome_completo: "Daniel Richard",
        email_usu: "danielSan@saga.com",
        senha_usu: "senha12345",
    });

    cy.get("@alerta").should("have.been.calledWith", "Usuário cadastrado com sucesso!");

    // O formulário deve ser limpo depois do cadastro
    cy.get("#nome").should("have.value", "");
    cy.get("#email").should("have.value", "");
    cy.get("#senha").should("have.value", "");
  });
});