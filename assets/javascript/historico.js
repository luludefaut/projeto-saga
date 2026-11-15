/* =====================================================
   HISTORICO.JS
   -----------------------------------------------------
   - Lista os relatórios FINALIZADOS (accordions)
   - Editar: só nas primeiras 24h depois de concluído
   - Excluir: pede confirmação e depois mostra a mensagem
     "Relatório excluído" com a opção de DESFAZER
===================================================== */

// Relatórios finalizados que estão na tela
let listaHistorico = [];

// Id do relatório que está sendo editado
let idEditando = null;

// Relatório que o usuário escolheu excluir (esperando a confirmação do modal)
let registroParaExcluir = null;

// Exclusão que já foi confirmada, mas ainda dá tempo de desfazer
// Guarda: { registro, item, timer }
let exclusaoPendente = null;

// Tempo (em milissegundos) que o botão "Desfazer" fica na tela
const TEMPO_PARA_DESFAZER = 6000;

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. CAPTURA DE ELEMENTOS DO DOM
  // ==========================================================================
  const listaElemento = document.getElementById("listaHistorico");
  const historicoVazio = document.getElementById("historicoVazio");

  const modalAtendGeral = document.getElementById("modalAtendGeral");
  const modalAcompPed = document.getElementById("modalAcompPed");

  const formAtendGeral = modalAtendGeral.querySelector("form");
  const formAcompPed = modalAcompPed.querySelector("form");

  const btnSalvarAtendGeral = modalAtendGeral.querySelector(".btn-salvarAtendimento");
  const btnSalvarPed = modalAcompPed.querySelector(".btn-salvarAtendimento");

  const modalExcluir = document.getElementById("modalExcluir");
  const btnCancelarExclusao = document.getElementById("btnCancelarExclusao");
  const btnConfirmarExclusao = document.getElementById("btnConfirmarExclusao");

  // Ativa a troca "tipo de curso -> cursos" (função do dados.js)
  ligarSelectsDeCurso();

  // ==========================================================================
  // 2. CARREGAR E MOSTRAR O HISTÓRICO
  // ==========================================================================
  async function carregarHistorico() {
    try {
      const todos = await buscarRegistros();

      // Aqui só os finalizados
      listaHistorico = todos.filter((r) => r.status_registro === "finalizado");

      // Mais novos primeiro (id maior = criado depois)
      listaHistorico.sort((a, b) => b.id_registro_pk - a.id_registro_pk);

      mostrarHistorico();
    } catch (erro) {
      mostrarMensagem(erro.message, "erro");
    }
  }

  function mostrarHistorico() {
    listaElemento.innerHTML = "";

    listaHistorico.forEach((registro) => {
      listaElemento.appendChild(criarAccordion(registro));
    });

    atualizarEstadoVazio();
  }

  // Mostra o aviso quando não sobrou nenhum accordion visível
  function atualizarEstadoVazio() {
    const itens = listaElemento.querySelectorAll(".accordion-item");
    let visiveis = 0;

    itens.forEach((item) => {
      if (item.style.display !== "none") visiveis++;
    });

    historicoVazio.style.display = visiveis === 0 ? "flex" : "none";
  }

  // ==========================================================================
  // 3. REGRA DAS 24 HORAS
  // ==========================================================================
  // Devolve true se o relatório foi concluído há menos de 24 horas
  function dentroDas24h(registro) {
    const conclusao = new Date(registro.data_conclusao);
    const horas = (new Date() - conclusao) / (1000 * 60 * 60);

    return horas <= 24; // se a data for inválida, vira NaN e dá false
  }

  // ==========================================================================
  // 4. MONTAR O ACCORDION (mesma estrutura e classes que já existiam)
  // ==========================================================================

  // <div class="info-item"><span>Turno</span><p>Manhã</p></div>
  function criarInfo(rotulo, valor) {
    const info = criar("div", "info-item");
    info.appendChild(criar("span", "", rotulo));
    info.appendChild(criar("p", "", valor));

    return info;
  }

  // Seção com título + grade de informações
  // campos: [ ["Turno", "Manhã"], ["Modalidade", "EAD"] ]
  function criarSecao(titulo, campos) {
    const secao = criar("section", "accordion-section");
    const grade = criar("div", "accordion-grid");

    secao.appendChild(criar("h4", "", titulo));

    campos.forEach((campo) => {
      grade.appendChild(criarInfo(campo[0], campo[1]));
    });

    secao.appendChild(grade);

    return secao;
  }

  // Seção com título + texto grande (Descrição e Tratativa NEP)
  function criarSecaoTexto(titulo, texto) {
    const secao = criar("section", "accordion-section");

    secao.appendChild(criar("h4", "", titulo));
    secao.appendChild(criar("div", "texto-completo", texto || "Não informado"));

    return secao;
  }

  function criarAccordion(registro) {
    const item = criar("article", "accordion-item");
    const podeEditar = dentroDas24h(registro);
    const ehAtendimentoGeral = registro.tipo_relatorio === "atendimento_geral";

    // ---------- CABEÇALHO (sempre visível) ----------
    const header = criar("button", "accordion-header");
    const esquerda = criar("div", "accordion-header-left");
    const titulo = criar("div", "icone-editar-temporario");

    titulo.appendChild(criar("h3", "", textoDe(NOME_TIPO_RELATORIO, registro.tipo_relatorio)));

    // Ícone de editar temporário: só aparece nas primeiras 24h
    if (podeEditar) {
      const icone = document.createElement("img");
      icone.src = "../assets/icons/editar-icon-blue.svg";
      icone.alt = "icone de editar temporário";

      icone.addEventListener("click", (evento) => {
        evento.stopPropagation(); // não abre/fecha o accordion
        abrirEdicao(registro);
      });

      titulo.appendChild(icone);
    }

    esquerda.appendChild(titulo);

    // Data de encerramento (se não tiver, usa a data em que foi concluído)
    let dataEncerrado = new Date(registro.data_conclusao).toLocaleDateString("pt-BR");

    if (registro.data_encerramento) {
      dataEncerrado = formatarData(registro.data_encerramento);
    }

    esquerda.appendChild(criar("p", "", "Encerrado em " + dataEncerrado));

    const direita = criar("div", "accordion-header-right");
    const seta = document.createElement("img");
    seta.src = "../assets/icons/seta-select.svg";
    seta.alt = "Abrir";
    seta.className = "accordion-arrow";

    direita.appendChild(criar("span", "accordion-status", "Finalizado"));
    direita.appendChild(seta);

    header.appendChild(esquerda);
    header.appendChild(direita);

    // Abre este accordion e fecha os outros
    header.addEventListener("click", () => {
      document.querySelectorAll(".accordion-item").forEach((outro) => {
        if (outro !== item) outro.classList.remove("active");
      });

      item.classList.toggle("active");
    });

    // ---------- CORPO (conteúdo completo) ----------
    const corpo = criar("div", "accordion-body");

    // Informações gerais
    const gerais = [
      ["Turno", textoDe(TEXTO_TURNO, registro.turno)],
      ["Modalidade", textoDe(TEXTO_MODALIDADE, registro.modalidade)],
      ["Turma", registro.turma || "Não informada"],
      ["Tipo de Curso", textoDe(NOME_TIPO_CURSO, tipoDoCurso(registro.id_curso_fk))],
      ["Curso", nomeDoCurso(registro.id_curso_fk)],
    ];

    if (!ehAtendimentoGeral) {
      gerais.push(["Tipo de Ação", textoDe(TEXTO_TIPO_ACAO, registro.tipo_acao)]);
    }

    gerais.push(["Data Inicial", formatarData(registro.data_inicial)]);
    gerais.push(["Data de Encerramento", formatarData(registro.data_encerramento)]);

    corpo.appendChild(criarSecao("Informações Gerais", gerais));

    // Segunda seção (muda conforme o tipo de relatório)
    if (ehAtendimentoGeral) {
      corpo.appendChild(
        criarSecao("Atendimento", [
          ["Tipo de Atendimento", textoDe(TEXTO_TIPO_ATENDIMENTO, registro.tipo_atendimento)],
          ["Status", "Finalizado"],
          ["Pedagogo", registro.pedagogo || "Não informado"],
          ["Instrutor / Aluno", registro.instrutor_aluno || "Não informado"],
          ["Coordenação", registro.coordenacao || "Não informada"],
        ])
      );
    } else {
      corpo.appendChild(
        criarSecao("Acompanhamento", [
          ["Tipo de Atendimento", textoDe(TEXTO_TIPO_ATENDIMENTO, registro.tipo_atendimento)],
          ["Tipo de Contratação", textoDe(TEXTO_CONTRATACAO, registro.tipo_contratacao)],
          ["Status", "Finalizado"],
          ["Relatório", textoDe(TEXTO_RELATORIO, registro.relatorio)],
          ["Instrutor / Aluno", registro.instrutor_aluno || "Não informado"],
          ["Coordenação", registro.coordenacao || "Não informada"],
          ["Pedagogo", registro.pedagogo || "Não informado"],
          ["Docente", registro.docente || "Não informado"],
        ])
      );
    }

    corpo.appendChild(criarSecaoTexto("Descrição", registro.descricao));
    corpo.appendChild(criarSecaoTexto("Tratativa NEP", registro.tratativa_nep));

    // Botões: Excluir sempre aparece | Editar só dentro das 24h
    const botoes = criar("div", "accordion-button");

    const btnExcluir = criar("button", "color-Red");
    btnExcluir.appendChild(criar("span", "", "Excluir Relatório"));
    btnExcluir.addEventListener("click", () => {
      registroParaExcluir = { registro: registro, item: item };
      modalExcluir.showModal();
    });

    botoes.appendChild(btnExcluir);

    if (podeEditar) {
      const btnEditar = criar("button", "color-Blue");
      btnEditar.appendChild(criar("span", "", "Editar Relatório"));
      btnEditar.addEventListener("click", () => abrirEdicao(registro));

      botoes.appendChild(btnEditar);
    }

    corpo.appendChild(botoes);

    item.appendChild(header);
    item.appendChild(corpo);

    return item;
  }

  // ==========================================================================
  // 5. EDITAR (modal)
  // ==========================================================================
  function abrirEdicao(registro) {
    idEditando = registro.id_registro_pk;

    if (registro.tipo_relatorio === "atendimento_geral") {
      preencherFormulario(formAtendGeral, registro);
      modalAtendGeral.showModal();
    } else {
      preencherFormulario(formAcompPed, registro);
      modalAcompPed.showModal();
    }
  }

  async function salvarEdicao(form, modal, tipoRelatorio, botao) {
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

    botao.disabled = true;

    try {
      await chamarApi("/historico/registro_pedagogico/" + idEditando, "PATCH", dados);

      modal.close();
      limparFormulario(form);
      idEditando = null;

      mostrarMensagem("Relatório atualizado com sucesso!", "sucesso");
      carregarHistorico();
    } catch (erro) {
      // Ex: passou das 24 horas (o back responde 403 com a mensagem)
      msgErro.textContent = erro.message;
    } finally {
      botao.disabled = false;
    }
  }

  btnSalvarAtendGeral.addEventListener("click", () => {
    salvarEdicao(formAtendGeral, modalAtendGeral, "atendimento_geral", btnSalvarAtendGeral);
  });

  btnSalvarPed.addEventListener("click", () => {
    salvarEdicao(formAcompPed, modalAcompPed, "acompanhamento_pedagogico", btnSalvarPed);
  });

  // ==========================================================================
  // 6. EXCLUIR (confirmação + "Desfazer" estilo WhatsApp)
  // ==========================================================================
  /*
    Como funciona:
    1. O usuário clica em "Excluir Relatório" e o modal pergunta se tem certeza.
    2. Ao confirmar, o accordion some da tela e aparece a barra
       "Relatório excluído | Desfazer".
    3. Se clicar em "Desfazer" dentro de 6 segundos, o accordion volta
       e NADA é apagado no banco.
    4. Se o tempo acabar, aí sim chamamos o DELETE na API.
  */
  btnCancelarExclusao.addEventListener("click", () => {
    registroParaExcluir = null;
    modalExcluir.close();
  });

  btnConfirmarExclusao.addEventListener("click", () => {
    modalExcluir.close();

    if (registroParaExcluir) {
      iniciarExclusao(registroParaExcluir.registro, registroParaExcluir.item);
      registroParaExcluir = null;
    }
  });

  function iniciarExclusao(registro, item) {
    // Se já tinha outra exclusão esperando, confirma ela agora
    if (exclusaoPendente) {
      confirmarExclusao();
    }

    item.style.display = "none"; // some da tela (ainda não apagou no banco)

    exclusaoPendente = {
      registro: registro,
      item: item,
      timer: setTimeout(confirmarExclusao, TEMPO_PARA_DESFAZER),
    };

    mostrarBarraDesfazer("Relatório excluído");
    atualizarEstadoVazio();
  }

  function desfazerExclusao() {
    if (!exclusaoPendente) return;

    clearTimeout(exclusaoPendente.timer);
    exclusaoPendente.item.style.display = ""; // volta para a tela

    exclusaoPendente = null;

    removerBarraDesfazer();
    atualizarEstadoVazio();
  }

  async function confirmarExclusao() {
    if (!exclusaoPendente) return;

    const registro = exclusaoPendente.registro;
    const item = exclusaoPendente.item;

    clearTimeout(exclusaoPendente.timer);
    exclusaoPendente = null;
    removerBarraDesfazer();

    try {
      await chamarApi("/historico/registro_pedagogico/" + registro.id_registro_pk, "DELETE");

      item.remove();
    } catch (erro) {
      // Não conseguiu excluir: o relatório volta para a tela
      item.style.display = "";
      mostrarMensagem("Não foi possível excluir o relatório. " + erro.message, "erro");
    }

    atualizarEstadoVazio();
  }

  // Barra preta no rodapé: "Relatório excluído   DESFAZER"
  function mostrarBarraDesfazer(texto) {
    removerBarraDesfazer();

    const barra = criar("div", "snackbar");
    barra.id = "barraDesfazer";

    const btnDesfazer = criar("button", "", "Desfazer");
    btnDesfazer.addEventListener("click", desfazerExclusao);

    barra.appendChild(criar("span", "", texto));
    barra.appendChild(btnDesfazer);

    document.body.appendChild(barra);
  }

  function removerBarraDesfazer() {
    const barra = document.getElementById("barraDesfazer");

    if (barra) barra.remove();
  }

  // Se o usuário sair da página (ou trocar de aba do menu) com uma exclusão
  // esperando, enviamos o DELETE na hora para a exclusão não se perder.
  window.addEventListener("pagehide", () => {
    if (!exclusaoPendente) return;

    fetch(API_URL + "/historico/registro_pedagogico/" + exclusaoPendente.registro.id_registro_pk, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + pegarToken() },
      keepalive: true, // deixa a requisição terminar mesmo saindo da página
    });
  });

  // ==========================================================================
  // 7. INÍCIO: carrega o histórico ao abrir a página
  // ==========================================================================
  carregarHistorico();
});
