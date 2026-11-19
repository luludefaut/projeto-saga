export function criarTokenFalso() {
  const cabecalho = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const corpo = btoa(
    JSON.stringify({ id: 1, exp: Math.floor(Date.now() / 1000) + 3600 })
  );
  return `${cabecalho}.${corpo}.assinatura-falsa`;
}

export const usuarioFalso = {
  nome_completo: "Usuário de Teste",
  email_usu: "teste@senai.com",
};

export function visitarLogado(caminho) {
  const token = criarTokenFalso();

  cy.visit(caminho, {
    onBeforeLoad(win) {
      win.localStorage.setItem("saga_token", token);
      win.localStorage.setItem("saga_usuario", JSON.stringify(usuarioFalso));
    },
  });
}