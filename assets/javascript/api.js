/* =====================================================
   API.JS
   -----------------------------------------------------
   Funções que TODAS as páginas usam:
   - guardar / pegar / apagar o token
   - mostrar mensagens na tela (sucesso, erro, aviso)
   - fazer as chamadas (fetch) para a API
   Este arquivo precisa ser carregado ANTES dos outros JS.
===================================================== */

// Endereço do back-end (o server.js usa a porta 3000)
const API_URL = "http://localhost:3000";

/* =====================================================
   TOKEN E SESSÃO
===================================================== */

// Pega o token que foi salvo no login
function pegarToken() {
  return localStorage.getItem("saga_token");
}

// Guarda o token e os dados do usuário depois do login
function salvarSessao(token, usuario) {
  localStorage.setItem("saga_token", token);
  localStorage.setItem("saga_usuario", JSON.stringify(usuario));
}

// Remove tudo que é da sessão (usado no "Encerrar sessão")
function limparSessao() {
  localStorage.removeItem("saga_token");
  localStorage.removeItem("saga_usuario");
}

// Confere se existe token e se ele ainda não expirou
// (o back gera o token com validade de 8 horas)
function tokenValido() {
  const token = pegarToken();

  if (!token) return false;

  try {
    // O JWT tem 3 partes separadas por ponto. A do meio guarda o "exp"
    const parteDoMeio = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const dados = JSON.parse(atob(parteDoMeio));

    // "exp" vem em segundos, o Date.now() vem em milissegundos
    return dados.exp * 1000 > Date.now();
  } catch (erro) {
    return false;
  }
}

// Se não estiver logado, manda para a tela de login
function exigirLogin() {
  if (!tokenValido()) {
    limparSessao();
    window.location.replace("../index.html");
  }
}

/* =====================================================
   MENSAGENS NA TELA
   -----------------------------------------------------
   tipo: "sucesso" | "erro" | "aviso"
   O visual está no final do global.css (.toast)
===================================================== */
function mostrarMensagem(texto, tipo) {
  // Cria a área onde as mensagens ficam empilhadas (só na primeira vez)
  let area = document.getElementById("areaMensagens");

  if (!area) {
    area = document.createElement("div");
    area.id = "areaMensagens";
    document.body.appendChild(area);
  }

  const aviso = document.createElement("div");
  aviso.className = "toast " + (tipo || "aviso");
  aviso.textContent = texto;

  area.appendChild(aviso);

  // Some sozinha depois de 4,5 segundos
  setTimeout(() => aviso.remove(), 4500);
}

/* =====================================================
   CHAMADAS PARA A API
===================================================== */

// Transforma o código de erro do back em um texto para o usuário
function textoDoErro(status, dados) {
  if (status === 400) {
    // O back manda a lista "erros" com o que está errado em cada campo
    if (dados && dados.erros && dados.erros.length > 0) {
      return dados.erros.map((e) => e.mensagem).join(" ");
    }
    return "Dados inválidos. Confira os campos e tente novamente.";
  }

  if (status === 401) {
    return (dados && dados.message) || "Sua sessão expirou. Faça login novamente.";
  }

  if (status === 403) {
    return (dados && dados.message) || "Você não tem permissão para fazer isso.";
  }

  if (status === 404) {
    return "Registro não encontrado. Ele pode ter sido removido.";
  }

  if (status === 409) {
    return "Esse e-mail já está cadastrado.";
  }

  return "Erro interno no servidor. Tente novamente mais tarde.";
}

/*
  Faz a chamada para a API.

  - rota:   ex "/auth/login"
  - metodo: "GET", "POST", "PATCH" ou "DELETE"
  - corpo:  objeto com os dados (opcional)

  Devolve os dados da resposta. Se der erro, lança um Error
  com o texto já pronto para mostrar ao usuário:

    try {
      const dados = await chamarApi("/rota", "POST", { ... });
    } catch (erro) {
      mostrarMensagem(erro.message, "erro");
    }
*/
async function chamarApi(rota, metodo, corpo) {
  const opcoes = {
    method: metodo,
    headers: { "Content-Type": "application/json" },
  };

  // Se tiver token, manda no header (as rotas privadas exigem)
  const token = pegarToken();
  if (token) {
    opcoes.headers.Authorization = "Bearer " + token;
  }

  if (corpo) {
    opcoes.body = JSON.stringify(corpo);
  }

  let resposta;

  // Se o servidor estiver desligado ou sem internet, cai aqui
  try {
    resposta = await fetch(API_URL + rota, opcoes);
  } catch (erro) {
    throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
  }

  // O 204 (exclusão) não devolve corpo, por isso o try/catch
  let dados = null;
  try {
    dados = await resposta.json();
  } catch (erro) {
    dados = null;
  }

  if (!resposta.ok) {
    // Token vencido ou inválido: volta para o login
    // (exceto na própria tela de login, onde 401 = senha errada)
    if (resposta.status === 401 && rota !== "/auth/login") {
      limparSessao();
      setTimeout(() => window.location.replace("../index.html"), 1500);
    }

    throw new Error(textoDoErro(resposta.status, dados));
  }

  return dados;
}

/*
  Busca os relatórios na rota do dashboard.

  ATENÇÃO: o back ainda não tem uma rota GET só para listar os
  relatórios, então as telas Relatório e Histórico usam esta
  (ela devolve todos e cada tela filtra pelo status).
  Quando criarem as rotas GET, é só trocar aqui dentro.

  filtros (opcional): { dataInicio, dataFim, tipo }
*/
async function buscarRegistros(filtros) {
  let rota = "/dashboard/registro_pedagogico";

  if (filtros) {
    rota += "?" + new URLSearchParams(filtros).toString();
  }

  const resposta = await chamarApi(rota, "GET");

  return resposta.dados;
}

/* =====================================================
   FUNÇÕES AJUDANTES
===================================================== */

// Cria um elemento já com classe e texto (deixa o código menor)
function criar(tag, classe, texto) {
  const elemento = document.createElement(tag);

  if (classe) elemento.className = classe;
  if (texto) elemento.textContent = texto;

  return elemento;
}

// Converte "2026-05-12" (ou "2026-05-12T00:00:00.000Z") para "12/05/2026"
function formatarData(texto) {
  if (!texto) return "Não informada";

  const partes = String(texto).slice(0, 10).split("-");

  return partes[2] + "/" + partes[1] + "/" + partes[0];
}
