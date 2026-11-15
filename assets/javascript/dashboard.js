/* =====================================================
   DASHBOARD.JS
   -----------------------------------------------------
   Busca os relatórios na API e mostra:
   - Os 4 cards (Total, Pendentes, Em andamento, Concluídos)
   - Gráfico de pizza: relatórios elaborados (por status)
   - Gráfico de barras: cursos com mais relatórios
   Os filtros (datas, curso e tipo) atualizam tudo.
===================================================== */

// Relatórios que vieram da API (guardados para filtrar o curso sem chamar a API de novo)
let registrosDoDashboard = [];

// Os dois gráficos (criados vazios e atualizados quando chegam os dados)
let graficoPizza;
let graficoBarras;

document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
  DETECÇÃO DE TAMANHO DE TELA
  -----------------------------------------------------
  Utilizado para adaptar o gráfico de cursos em
  dispositivos menores.
  ===================================================== */
  const isMobile = window.innerWidth <= 768;
  const isSmallScreen = window.innerWidth <= 600;

  // Elementos dos filtros
  const filtroDataInicio = document.getElementById("dataInicio");
  const filtroDataFim = document.getElementById("dataFim");
  const filtroCurso = document.getElementById("categoria");
  const filtroTipo = document.getElementById("relatorio");

  // Os 4 números dos cards: Total, Pendentes, Em Andamento, Concluídos
  const numerosDosCards = document.querySelectorAll(".dado p");

  // ==========================================================================
  // 1. GRÁFICOS (começam vazios)
  // ==========================================================================

  // Gráfico de setores (Pie Chart)
  const ctxRelatorios = document.getElementById("graficoRelatorios").getContext("2d");

  graficoPizza = new Chart(ctxRelatorios, {
    type: "pie",
    data: {
      labels: ["Pendentes", "Em Andamento", "Concluídos"],
      datasets: [
        {
          label: "Quantidade de Relatórios",
          data: [0, 0, 0], // é preenchido por atualizarTela()
          backgroundColor: ["#CC47EA", "#659FD9", "#5dd15dff"],
          borderWidth: 1,
          borderColor: "#000000ff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Permite que o CSS controle o tamanho
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: { size: 13 },
            boxWidth: 15,
          },
        },
        tooltip: { enabled: true },
      },
    },
  });

  // Gráfico de barras (cursos com mais relatórios)
  const ctxCursos = document.getElementById("graficoCursos").getContext("2d");

  graficoBarras = new Chart(ctxCursos, {
    type: "bar",
    data: {
      labels: [], // nomes dos cursos (preenchido por atualizarTela())
      datasets: [
        {
          label: "Total de Relatórios",
          data: [], // quantidade de cada curso
          backgroundColor: "#040446",
          borderColor: "#040446",
          borderWidth: 1.5,
          borderRadius: 4,
        },
      ],
    },
    options: {
      indexAxis: isSmallScreen ? "y" : "x",
      responsive: true,
      maintainAspectRatio: false, // Respeita a altura da div pai
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,.05)" },
        },
        y: {
          grid: { display: false },
          ticks: {
            autoSkip: false,
            font: { size: isSmallScreen ? 11 : 12 },
            precision: 0, // só números inteiros
          },
        },
      },
    },
  });

  // ==========================================================================
  // 2. BUSCAR OS DADOS NA API (usa os filtros de data e tipo)
  // ==========================================================================
  async function carregarDashboard() {
    const filtros = {};

    const dataInicio = filtroDataInicio.value;
    const dataFim = filtroDataFim.value;

    // A API exige as duas datas juntas
    if (dataInicio && !dataFim) {
      mostrarMensagem("Preencha também a data final para filtrar por período.", "aviso");
      return;
    }

    if (!dataInicio && dataFim) {
      mostrarMensagem("Preencha também a data inicial para filtrar por período.", "aviso");
      return;
    }

    if (dataInicio && dataFim) {
      if (dataFim < dataInicio) {
        mostrarMensagem("A data final não pode ser anterior à data inicial.", "erro");
        return;
      }

      filtros.dataInicio = dataInicio;
      filtros.dataFim = dataFim;
    }

    if (filtroTipo.value) {
      filtros.tipo = filtroTipo.value;
    }

    try {
      registrosDoDashboard = await buscarRegistros(filtros);
      atualizarTela();
    } catch (erro) {
      mostrarMensagem(erro.message, "erro");
    }
  }

  // ==========================================================================
  // 3. ATUALIZAR CARDS E GRÁFICOS
  // ==========================================================================

  // Tira acentos e deixa minúsculo ("Técnico" -> "tecnico") para comparar textos
  function semAcento(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function atualizarTela() {
    // O filtro de curso é feito aqui (digitou "sistemas", acha o curso pelo nome)
    const textoCurso = semAcento(filtroCurso.value.trim());

    const registros = registrosDoDashboard.filter((r) => {
      if (textoCurso === "") return true;

      return semAcento(nomeDoCurso(r.id_curso_fk)).includes(textoCurso);
    });

    // ---------- Cards ----------
    const pendentes = registros.filter((r) => r.status_registro === "pendente").length;
    const andamento = registros.filter((r) => r.status_registro === "andamento").length;
    const concluidos = registros.filter((r) => r.status_registro === "finalizado").length;

    numerosDosCards[0].textContent = registros.length;
    numerosDosCards[1].textContent = pendentes;
    numerosDosCards[2].textContent = andamento;
    numerosDosCards[3].textContent = concluidos;

    // ---------- Gráfico de pizza ----------
    graficoPizza.data.datasets[0].data = [pendentes, andamento, concluidos];
    graficoPizza.update();

    // ---------- Gráfico de barras: top 5 cursos ----------
    // Conta quantos relatórios cada curso tem. Ex: { 4: 7, 2: 3 }
    const contagem = {};

    registros.forEach((r) => {
      if (!r.id_curso_fk) return; // relatório sem curso não entra no gráfico

      contagem[r.id_curso_fk] = (contagem[r.id_curso_fk] || 0) + 1;
    });

    // Ordena do maior para o menor e pega só os 5 primeiros
    const maiores = Object.keys(contagem)
      .sort((a, b) => contagem[b] - contagem[a])
      .slice(0, 5);

    graficoBarras.data.labels = maiores.map((id) => nomeDoCurso(id));
    graficoBarras.data.datasets[0].data = maiores.map((id) => contagem[id]);
    graficoBarras.update();
  }

  // ==========================================================================
  // 4. FILTROS
  // ==========================================================================

  // Datas e tipo precisam consultar a API de novo
  filtroDataInicio.addEventListener("change", carregarDashboard);
  filtroDataFim.addEventListener("change", carregarDashboard);
  filtroTipo.addEventListener("change", carregarDashboard);

  // O curso é filtrado na hora, sem chamar a API
  filtroCurso.addEventListener("input", () => {
    mostrarSugestoes();
    atualizarTela();
  });

  // ==========================================================================
  // 4.1 SUGESTÕES DE CURSO (enquanto digita)
  // ==========================================================================
  const listaSugestoes = document.getElementById("sugestoesCurso");

  function esconderSugestoes() {
    listaSugestoes.style.display = "none";
  }

  // Mostra os cursos que contêm o texto digitado (sem diferenciar acento/maiúscula)
  function mostrarSugestoes() {
    const texto = semAcento(filtroCurso.value.trim());

    listaSugestoes.innerHTML = "";

    // Campo vazio: não sugere nada
    if (texto === "") {
      esconderSugestoes();
      return;
    }

    // include: o nome do curso só entra se tiver o texto digitado dentro dele
    const encontrados = LISTA_CURSOS.filter((curso) => semAcento(curso.nome).includes(texto));

    if (encontrados.length === 0) {
      listaSugestoes.appendChild(criar("li", "vazio", "Nenhum curso encontrado"));
    }

    // Mostra no máximo 8 sugestões (a lista tem rolagem)
    encontrados.slice(0, 8).forEach((curso) => {
      const item = criar("li", "", curso.nome);

      // Clicou na sugestão: preenche o campo e filtra por esse curso
      item.addEventListener("click", () => {
        filtroCurso.value = curso.nome;
        esconderSugestoes();
        atualizarTela();
      });

      listaSugestoes.appendChild(item);
    });

    listaSugestoes.style.display = "block";
  }

  // Clicou fora do campo: fecha a lista
  document.addEventListener("click", (evento) => {
    if (!evento.target.closest(".filtro-curso")) {
      esconderSugestoes();
    }
  });

  // Tecla Esc também fecha
  filtroCurso.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") esconderSugestoes();
  });

  // Voltou para o campo com texto digitado: mostra as sugestões de novo
  filtroCurso.addEventListener("focus", mostrarSugestoes);

  // ==========================================================================
  // 5. INÍCIO: carrega ao abrir a página
  // ==========================================================================
  carregarDashboard();
});
