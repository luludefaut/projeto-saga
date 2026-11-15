/* =====================================================
   FORMULARIO.JS
   -----------------------------------------------------
   Funções dos formulários de relatório (Atendimento Geral
   e Acompanhamento Pedagógico). Usadas na página Relatório
   e também no modal de edição do Histórico.

   O "name" de cada campo no HTML é igual ao nome da coluna
   no banco (ex: name="tipo_atendimento"), por isso dá para
   ler o formulário inteiro com um for.
===================================================== */

// Esse campo só serve para escolher o curso, não vai para a API
const CAMPO_SO_VISUAL = "tipo_curso";

/* =====================================================
   LER O FORMULÁRIO
   Devolve um objeto: { turno: "manha", turma: null, ... }
   Campo vazio vira null.
===================================================== */
function lerFormulario(form) {
  const dados = {};

  for (const campo of form.elements) {
    if (!campo.name || campo.name === CAMPO_SO_VISUAL) continue;

    const valor = campo.value.trim();

    if (valor === "") {
      dados[campo.name] = null;
    } else if (campo.name === "id_curso_fk") {
      dados[campo.name] = Number(valor); // o banco espera número
    } else {
      dados[campo.name] = valor;
    }
  }

  return dados;
}

/* =====================================================
   LIMPAR O FORMULÁRIO
===================================================== */
function limparFormulario(form) {
  form.reset();

  // Avisa o select de tipo de curso que mudou, para zerar a lista de cursos
  form.elements[CAMPO_SO_VISUAL].dispatchEvent(new Event("change"));

  // Tira mensagem de erro e as bordas vermelhas
  form.querySelector(".msg-erro").textContent = "";

  for (const campo of form.elements) {
    campo.classList.remove("campo-erro");
  }
}

/* =====================================================
   PREENCHER O FORMULÁRIO (usado na edição)
   Recebe o relatório que veio da API e coloca nos campos.
===================================================== */
function preencherFormulario(form, registro) {
  limparFormulario(form);

  // 1º o tipo de curso, para a lista de cursos ser montada
  const tipo = tipoDoCurso(registro.id_curso_fk);

  if (tipo) {
    const selectTipo = form.elements[CAMPO_SO_VISUAL];
    selectTipo.value = tipo;
    selectTipo.dispatchEvent(new Event("change"));
  }

  // 2º todos os outros campos
  for (const campo of form.elements) {
    if (!campo.name || campo.name === CAMPO_SO_VISUAL) continue;

    let valor = registro[campo.name];

    if (valor === null || valor === undefined) continue;

    // O input de data só aceita "AAAA-MM-DD"
    if (campo.type === "date") {
      valor = String(valor).slice(0, 10);
    }

    campo.value = valor;
  }
}

/* =====================================================
   NOME DO CAMPO (para a mensagem de erro)
   Cada tipo de campo guarda seu nome em um lugar diferente
===================================================== */
function nomeDoCampo(campo) {
  let nome = "";

  if (campo.tagName === "SELECT") {
    nome = campo.options[0].textContent; // ex: "TURNO"
  } else if (campo.tagName === "TEXTAREA") {
    nome = campo.parentElement.querySelector("label").textContent;
  } else if (campo.type === "date") {
    nome = campo.parentElement.querySelector("p").textContent;
  } else {
    nome = campo.placeholder;
  }

  // "TIPO DE CURSO" -> "Tipo de curso"
  nome = nome.trim().toLowerCase();
  return nome.charAt(0).toUpperCase() + nome.slice(1);
}

/* =====================================================
   VALIDAR O FORMULÁRIO
   Devolve o texto do erro, ou "" se estiver tudo certo.

   Regras:
   - Para salvar como pendente / em andamento: data, pedagogo
     e status são obrigatórios.
   - Para FINALIZAR: TODOS os campos precisam estar preenchidos.
===================================================== */
function validarFormulario(form) {
  const dados = lerFormulario(form);
  const finalizando = dados.status_registro === "finalizado";
  const obrigatorios = ["data_inicial", "pedagogo", "status_registro"];

  // Limpa as bordas vermelhas da tentativa anterior
  for (const campo of form.elements) {
    campo.classList.remove("campo-erro");
  }

  // 1. Campos que ficaram vazios
  const faltando = [];

  for (const campo of form.elements) {
    if (!campo.name) continue;

    const vazio = campo.value.trim() === "";
    const precisa = finalizando || obrigatorios.includes(campo.name);

    if (vazio && precisa) {
      faltando.push(campo);
    }
  }

  if (faltando.length > 0) {
    // Marca os campos de vermelho (some quando o usuário mexer neles)
    faltando.forEach(function (campo) {
      campo.classList.add("campo-erro");

      const tirarMarca = () => campo.classList.remove("campo-erro");
      campo.addEventListener("input", tirarMarca, { once: true });
      campo.addEventListener("change", tirarMarca, { once: true });
    });

    const nomes = faltando.map(nomeDoCampo).join(", ");

    if (finalizando) {
      return "Para finalizar o relatório, preencha todos os campos: " + nomes + ".";
    }

    return "Preencha os campos obrigatórios: " + nomes + ".";
  }

  // 2. Tamanho mínimo dos textos (o back também confere isso)
  const minimos = {
    turma: 3,
    pedagogo: 2,
    instrutor_aluno: 2,
    coordenacao: 2,
    docente: 2,
    tratativa_nep: 3,
    descricao: 5,
  };

  for (const nome in minimos) {
    if (dados[nome] && dados[nome].length < minimos[nome]) {
      const campo = form.elements[nome];
      campo.classList.add("campo-erro");

      return "O campo " + nomeDoCampo(campo).toLowerCase() + " precisa ter pelo menos " + minimos[nome] + " caracteres.";
    }
  }

  // 3. A data de encerramento não pode vir antes da data inicial
  if (dados.data_encerramento && dados.data_encerramento < dados.data_inicial) {
    form.elements["data_encerramento"].classList.add("campo-erro");

    return "A data de encerramento não pode ser anterior à data.";
  }

  return "";
}
