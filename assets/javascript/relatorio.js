/* =====================================================
   RELATORIO.JS
   -----------------------------------------------------
   - Lista os relatórios Pendentes e Em andamento (cards)
   - Cria novos relatórios
   - Edita pelo botão "Editar" do card
   - Relatório FINALIZADO sai daqui e vai para o Histórico
===================================================== */

// Relatórios que estão aparecendo nos cards
let listaRegistros = [];

// null = criando um novo | número = id do relatório que está sendo editado
let idEditando = null;

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. CAPTURA DE ELEMENTOS DO DOM
  // ==========================================================================
  const btnNovoRelatorio = document.getElementById("btnNovoRelatorio");

  const listaRelatorios = document.getElementById("listaRelatorios");
  const estadoVazio = document.getElementById("estadoVazio");

  const modalTipoRelatorio = document.getElementById("modalTipoRelatorio");
  const modalAtendGeral = document.getElementById("modalAtendGeral");
  const modalAcompPed = document.getElementById("modalAcompPed");

  const btnAtendGeral = document.getElementById("btnAtendGeral");
  const btnAcompPed = document.getElementById("btnAcompPed");

  const btnVoltarAtend = document.getElementById("btnVoltarAtend");
  const btnVoltarPed = document.getElementById("btnVoltarPed");

  const formAtendGeral = modalAtendGeral.querySelector("form");
  const formAcompPed = modalAcompPed.querySelector("form");

  const btnSalvarAtendGeral = modalAtendGeral.querySelector(".btn-salvarAtendimento");
  const btnSalvarPed = modalAcompPed.querySelector(".btn-salvarAtendimento");

  // Ativa a troca "tipo de curso -> cursos" (função do dados.js)
  ligarSelectsDeCurso();

  // ==========================================================================
  // 2. INTERAÇÕES CONDICIONAIS (FLUXO DE NAVEGAÇÃO DOS MODAIS)
  // ==========================================================================
  btnNovoRelatorio.addEventListener("click", () => {
    // Começa um relatório novo: formulários limpos e botão voltar visível
    idEditando = null;

    limparFormulario(formAtendGeral);
    limparFormulario(formAcompPed);

    btnVoltarAtend.style.visibility = "visible";
    btnVoltarPed.style.visibility = "visible";

    modalTipoRelatorio.showModal();
  });

  btnAtendGeral.addEventListener("click", () => {
    modalTipoRelatorio.close();
    modalAtendGeral.showModal();
  });

  btnAcompPed.addEventListener("click", () => {
    modalTipoRelatorio.close();
    modalAcompPed.showModal();
  });

  btnVoltarAtend.addEventListener("click", () => {
    modalAtendGeral.close();
    modalTipoRelatorio.showModal();
  });

  btnVoltarPed.addEventListener("click", () => {
    modalAcompPed.close();
    modalTipoRelatorio.showModal();
  });

  // ==========================================================================
  // 3. CARDS DOS RELATÓRIOS
  // ==========================================================================

  // Busca na API e mostra os relatórios que ainda não foram finalizados
  async function carregarRelatorios() {
    try {
      const todos = await buscarRegistros();

      // Finalizados ficam no Histórico, aqui só pendente e andamento
      listaRegistros = todos.filter((r) => r.status_registro !== "finalizado");

      // Mais novos primeiro (id maior = criado depois)
      listaRegistros.sort((a, b) => b.id_registro_pk - a.id_registro_pk);

      mostrarCards();
    } catch (erro) {
      mostrarMensagem(erro.message, "erro");
    }
  }

  // Desenha os cards na tela
  function mostrarCards() {
    listaRelatorios.innerHTML = "";

    // Sem relatórios: mostra o aviso "Sem relatórios por enquanto"
    if (listaRegistros.length === 0) {
      estadoVazio.style.display = "flex";
      return;
    }

    estadoVazio.style.display = "none";

    listaRegistros.forEach((registro) => {
      listaRelatorios.appendChild(criarCard(registro));
    });
  }

  // Cria um <p><strong>Título:</strong> valor</p>
  function criarLinha(titulo, valor) {
    const linha = document.createElement("p");
    const negrito = criar("strong", "", titulo + ":");

    linha.appendChild(negrito);
    linha.appendChild(document.createTextNode(" " + valor));

    return linha;
  }

  // Monta um card (mesma estrutura e classes que já existiam no HTML)
  function criarCard(registro) {
    const card = criar("div", "card-relatorio");

    // Cabeçalho: título + status
    const header = criar("div", "card-header");
    header.appendChild(criar("h3", "", textoDe(NOME_TIPO_RELATORIO, registro.tipo_relatorio)));
    header.appendChild(criar("span", "status-tag " + registro.status_registro, textoDe(TEXTO_STATUS, registro.status_registro)));

    // Corpo
    const corpo = criar("div", "card-body");
    corpo.appendChild(criarLinha("Turma", registro.turma || "Não informada"));
    corpo.appendChild(criarLinha("Curso", nomeDoCurso(registro.id_curso_fk)));
    corpo.appendChild(criarLinha("Data", formatarData(registro.data_inicial)));

    // Descrição: o CSS corta em 3 linhas com "..." (classe descricao-card)
    // O texto completo aparece ao passar o mouse e na hora de editar
    const linhaDescricao = criarLinha("Descrição", registro.descricao || "Sem descrição...");
    linhaDescricao.classList.add("descricao-card");
    linhaDescricao.title = registro.descricao || "";
    corpo.appendChild(linhaDescricao);

    // Rodapé: botão editar
    const footer = criar("div", "card-footer");
    const btnEditar = criar("button", "btn-editar-card");
    const icone = document.createElement("img");
    icone.src = "../assets/icons/editar-icon.svg";
    icone.alt = "Editar";

    btnEditar.appendChild(icone);
    btnEditar.appendChild(document.createTextNode("Editar"));
    btnEditar.addEventListener("click", () => abrirEdicao(registro));

    footer.appendChild(btnEditar);

    card.appendChild(header);
    card.appendChild(corpo);
    card.appendChild(footer);

    return card;
  }

  // ==========================================================================
  // 4. EDITAR RELATÓRIO
  // ==========================================================================
  function abrirEdicao(registro) {
    idEditando = registro.id_registro_pk;

    // Abre o modal do tipo certo, já com os campos preenchidos
    if (registro.tipo_relatorio === "atendimento_geral") {
      preencherFormulario(formAtendGeral, registro);
      btnVoltarAtend.style.visibility = "hidden"; // editando não troca de tipo
      modalAtendGeral.showModal();
    } else {
      preencherFormulario(formAcompPed, registro);
      btnVoltarPed.style.visibility = "hidden";
      modalAcompPed.showModal();
    }
  }

  // ==========================================================================
  // 5. SALVAR RELATÓRIO (novo ou edição)
  // ==========================================================================
  async function salvarRelatorio(form, modal, tipoRelatorio, botao) {
    const msgErro = form.querySelector(".msg-erro");
    msgErro.textContent = "";

    // Confere os campos antes de enviar
    const erro = validarFormulario(form);

    if (erro) {
      msgErro.textContent = erro;
      return;
    }

    const dados = lerFormulario(form);
    dados.tipo_relatorio = tipoRelatorio;

    // Evita clicar duas vezes enquanto envia
    botao.disabled = true;

    try {
      if (idEditando) {
        // EDIÇÃO
        await chamarApi("/relatorio/registro_pedagogico/" + idEditando, "PATCH", dados);
      } else {
        // NOVO: a API só aceita criar como "pendente" ou "andamento".
        // Se o usuário escolheu "finalizado", criamos como andamento e
        // logo em seguida atualizamos para finalizado.
        const querFinalizar = dados.status_registro === "finalizado";

        if (querFinalizar) {
          dados.status_registro = "andamento";
        }

        const novo = await chamarApi("/relatorio/registro_pedagogico", "POST", dados);

        if (querFinalizar) {
          await chamarApi("/relatorio/registro_pedagogico/" + novo.id_registro_pk, "PATCH", {
            status_registro: "finalizado",
          });
        }
      }

      const finalizou = form.elements["status_registro"].value === "finalizado";

      modal.close();
      limparFormulario(form);
      idEditando = null;

      if (finalizou) {
        mostrarMensagem("Relatório finalizado e enviado para o Histórico!", "sucesso");
      } else {
        mostrarMensagem("Relatório salvo com sucesso!", "sucesso");
      }

      carregarRelatorios();
    } catch (erro) {
      // Erro da API aparece dentro do modal, onde o usuário está olhando
      msgErro.textContent = erro.message;
    } finally {
      botao.disabled = false;
    }
  }

  btnSalvarAtendGeral.addEventListener("click", () => {
    salvarRelatorio(formAtendGeral, modalAtendGeral, "atendimento_geral", btnSalvarAtendGeral);
  });

  btnSalvarPed.addEventListener("click", () => {
    salvarRelatorio(formAcompPed, modalAcompPed, "acompanhamento_pedagogico", btnSalvarPed);
  });

  // ==========================================================================
  // 6. INÍCIO: carrega os relatórios ao abrir a página
  // ==========================================================================
  carregarRelatorios();
});
