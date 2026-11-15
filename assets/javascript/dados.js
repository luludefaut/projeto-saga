/* =====================================================
   DADOS.JS
   -----------------------------------------------------
   Lista de cursos e os textos que aparecem na tela
   (o banco guarda "manha", a tela mostra "Manhã").
   Usado em: Relatório, Histórico e Dashboard.
===================================================== */

/* =====================================================
   CURSOS
   -----------------------------------------------------
   O banco guarda o curso pelo ID (id_curso_fk), então cada
   curso recebe um número seguindo a ORDEM desta lista:
   1, 2, 3...

   IMPORTANTE: a tabela "curso" do banco precisa estar com
   os mesmos IDs. Use o arquivo seed_cursos.sql para isso.
   Se mudar a ordem ou adicionar curso aqui, atualize o SQL.
===================================================== */
const NOMES_DOS_CURSOS = {
  tecnico: [
    "Técnico de/em Eletromecânica", "Técnico em Administração", "Técnico em Automação / Automação Industrial",
    "Técnico em Desenvolvimento de Sistemas / Sistema", "Técnico em Edificações", "Técnico em Eletrotécnica",
    "Técnico em Informática / Informática para Internet", "Técnico em Logística", "Técnico em Manutenção Automotiva / Automotiva",
    "Técnico em Planejamento e Controle da Produção / EAD", "Técnico em Qualidade", "Técnico em Segurança do Trabalho",
  ],
  curso_de_qualificacao_aperfeicoamento_extensao: [
    "Agente de Gestão de Resíduos Sólidos Industriais e Urbanos", "Almoxarife", "Aperfeiçoamento em Caldeiraria Industrial",
    "Assistente Administrativo / Assistente ADM", "Assistente de Logística", "Assistente de Produção",
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

// Monta uma lista só, com id, nome e tipo de cada curso
// Exemplo: { id: 4, nome: "Técnico em Desenvolvimento de Sistemas / Sistema", tipo: "tecnico" }
const LISTA_CURSOS = [];
let proximoIdCurso = 1;

for (const tipo in NOMES_DOS_CURSOS) {
  NOMES_DOS_CURSOS[tipo].forEach(function (nome) {
    LISTA_CURSOS.push({ id: proximoIdCurso, nome: nome, tipo: tipo });
    proximoIdCurso++;
  });
}

// Recebe o id do curso e devolve o nome ("Não informado" se não tiver)
function nomeDoCurso(id) {
  const curso = LISTA_CURSOS.find((c) => c.id === Number(id));
  return curso ? curso.nome : "Não informado";
}

// Recebe o id do curso e devolve o tipo ("tecnico", "programas"...) ou ""
function tipoDoCurso(id) {
  const curso = LISTA_CURSOS.find((c) => c.id === Number(id));
  return curso ? curso.tipo : "";
}

/* =====================================================
   SELECTS DE CURSO (tipo de curso -> lista de cursos)
   -----------------------------------------------------
   Quando o usuário escolhe o TIPO DE CURSO, o select de
   CURSO é preenchido só com os cursos daquele tipo.
===================================================== */
function ligarSelectsDeCurso() {
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

      if (!tipoSelecionado) return;

      // Só os cursos do tipo escolhido
      LISTA_CURSOS.filter((c) => c.tipo === tipoSelecionado).forEach(function (curso) {
        const option = document.createElement("option");
        option.value = curso.id; // o valor é o ID, que é o que o banco guarda
        option.textContent = curso.nome;
        campoCurso.appendChild(option);
      });
    });
  });
}

/* =====================================================
   TEXTOS PARA EXIBIR
   -----------------------------------------------------
   Uso: textoDe(TEXTO_TURNO, "manha")  ->  "Manhã"
===================================================== */
const NOME_TIPO_RELATORIO = {
  atendimento_geral: "Atendimento Geral",
  acompanhamento_pedagogico: "Acompanhamento Pedagógico",
};

const NOME_TIPO_CURSO = {
  tecnico: "Técnico",
  curso_de_qualificacao_aperfeicoamento_extensao: "Qualificação, Aperfeiçoamento e Extensão",
  programas: "Programas",
};

const TEXTO_STATUS = {
  pendente: "Pendente",
  andamento: "Em Andamento",
  finalizado: "Finalizado",
};

const TEXTO_TURNO = { manha: "Manhã", tarde: "Tarde", noite: "Noite" };

const TEXTO_MODALIDADE = { presencial: "Presencial", ead: "EAD", hibrido: "Híbrido" };

const TEXTO_TIPO_ACAO = {
  acompanhamento_docente_turma: "Acompanhamento Docente | Turma",
  docente: "Docente",
};

const TEXTO_CONTRATACAO = { horista: "Horista", mensalista: "Mensalista", rsa: "RSA" };

const TEXTO_RELATORIO = {
  na: "N.A",
  arquivado: "Arquivado",
  andamento: "Em Andamento",
  falta_feedback: "Falta Feedback",
  observacoes: "Observações",
};

const TEXTO_TIPO_ATENDIMENTO = {
  acolhimento: "Acolhimento",
  acompanhamento: "Acompanhamento",
  afastamento_temporario: "Afastamento Temporário",
  advertencia: "Advertência",
  ambientacao_docente: "Ambientação Docente",
  aplicacao_de_pesquisa: "Aplicação de Pesquisa",
  apoio_a_coordenacao: "Apoio à Coordenação",
  atendimento_emergencial: "Atendimento Emergencial",
  boas_vindas: "Boas-vindas",
  calcado_inadequado: "Calçado Inadequado",
  fardamento_inadequado: "Fardamento Inadequado",
  intervencao_pedagogica: "Intervenção Pedagógica",
  miniaula: "Miniaula",
  na: "N.A",
  orientacao_aluno: "Orientação Aluno",
  orientacao_reuniao_instrutora: "Orientação / Reunião Instrutora",
  outros: "Outros",
  pais_resp: "Pais / Responsáveis",
  reuniao: "Reunião",
  visita_pedagogica: "Visita Pedagógica",
};

// Procura o texto no dicionário. Se o valor for vazio, devolve "Não informado"
function textoDe(dicionario, valor) {
  if (!valor) return "Não informado";

  return dicionario[valor] || valor;
}
