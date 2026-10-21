let dadosConcluidos = document.getElementById;

document.addEventListener("DOMContentLoaded", () => {
    /* =====================================================
    DETECÇÃO DE TAMANHO DE TELA
    -----------------------------------------------------
    Utilizado para adaptar o gráfico de cursos em
    dispositivos menores.
    ===================================================== */
  const isMobile = window.innerWidth <= 768;
  const isSmallScreen = window.innerWidth <= 600;

  // 1. Captura o contexto do canvas do primeiro gráfico
  const ctxRelatorios = document
    .getElementById("graficoRelatorios")
    .getContext("2d");

  // 2. Inicializa o gráfico de setores (Pie Chart)
  new Chart(ctxRelatorios, {
    type: "pie", // Define o gráfico de setores
    data: {
      // As fatias do gráfico (baseadas nos seus cards de dados)
      labels: ["Pendentes", "Em Andamento", "Concluídos"],
      datasets: [
        {
          label: "Quantidade de Relatórios",
          data: [10, 28, 70], // Substitua aqui pelos valores reais do seu sistema
          backgroundColor: ["#CC47EA", "#659FD9", "#5dd15dff"],
          borderWidth: 1,
          borderColor: "#000000ff", // Linha branca separando as fatias
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Permite que o CSS controle o tamanho
      plugins: {
        legend: {
          position: "bottom", // Coloca as legendas abaixo do gráfico
          labels: {
            font: {
              size: 13,
            },
            boxWidth: 15,
          },
        },
        tooltip: {
          // Configura o balãozinho que aparece ao passar o mouse
          enabled: true,
        },
      },
    },
  });

  const ctxCursos = document.getElementById("graficoCursos").getContext("2d");
  new Chart(ctxCursos, {
    type: "bar", // Define o gráfico de barras
    data: {
      // Os cursos que aparecerão no eixo X (Horizontal)
      labels: [
        "Administração",
        "Análise de Sistemas",
        "Direito",
        "Enfermagem",
        "Engenharia",
      ],
      datasets: [
        {
          label: "Total de Relatórios",
          // A quantidade de relatórios de cada curso respectivo no eixo Y (Vertical)
          data: [12, 4, 18, 22, 18],

          // Uma cor sólida azulada para combinar com o "Saga Blue" do seu projeto
          backgroundColor: "#040446",
          borderColor: "#040446",
          borderWidth: 1.5,

          // Arredonda levemente o topo das barras para um visual mais moderno
          borderRadius: 4,
        },
      ],
    },
    options: {
      indexAxis: isSmallScreen ? "y" : "x",
      responsive: true,
      maintainAspectRatio: false, // Respeita a altura da div pai
      plugins: {
        legend: {
          display: false, // Esconde a legenda superior, já que o título do gráfico já explica o que é
        },
      },
      scales: {
        x: {
          beginAtZero: true,

          grid: {
            color: "rgba(0,0,0,.05)",
          },
        },

        y: {
          grid: {
            display: false,
          },

          ticks: {
            autoSkip: false,

            font: {
              size: isSmallScreen ? 11 : 12,
            },
          },
        },
      },
    },
  });
});
