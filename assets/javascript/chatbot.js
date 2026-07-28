/* =====================================================
   CHATBOT VISUAL
   -----------------------------------------------------
   Responsável por exibir mensagens enviadas pelo
   usuário na tela.
===================================================== */

const chatInput = document.getElementById("chatInput");

const btnEnviar = document.getElementById("btnEnviar");

const chatMensagens = document.getElementById("chatMensagens");

/* =====================================================
   AUTO ALTURA DO INPUT
   -----------------------------------------------------
   Comportamento semelhante ao ChatGPT:

   - Começa pequeno
   - Cresce conforme o usuário digita
   - Para de crescer ao atingir o limite
   - Depois ativa scroll interno
===================================================== */

function ajustarAlturaInput() {
  /*
      Zeramos a altura temporariamente
      para recalcular corretamente.
    */
  chatInput.style.height = "0px";

  /*
      Altura máxima permitida.
    */
  const alturaMaxima = 180;

  /*
      Obtém a altura real necessária
      para exibir todo o conteúdo.
    */
  const novaAltura = Math.min(chatInput.scrollHeight, alturaMaxima);

  /*
      Aplica a nova altura.
    */
  chatInput.style.height = novaAltura + "px";

  /*
      Se ultrapassar o limite,
      ativa scroll interno.
    */
  if (chatInput.scrollHeight > alturaMaxima) {
    chatInput.style.overflowY = "auto";
  } else {
    chatInput.style.overflowY = "hidden";
  }
}

/* =====================================================
   CRIAR MENSAGEM
===================================================== */

function criarMensagem(texto, classe) {
  const mensagem = document.createElement("div");

  mensagem.classList.add("mensagem", classe);

  mensagem.textContent = texto;

  chatMensagens.appendChild(mensagem);

  /*
      Faz a conversa acompanhar
      automaticamente a última mensagem.
    */
  chatMensagens.scrollTop = chatMensagens.scrollHeight;
}

/* =====================================================
   ENVIAR MENSAGEM (ATUALIZADA)
===================================================== */
function enviarMensagem() {
  const texto = chatInput.value.trim();

  //   Impede envio vazio.

  if (texto === "") return;

  //   Cria a mensagem do usuário.

  criarMensagem(texto, "usuario");

  //   Limpa o campo.

  chatInput.value = "";

  //   Retorna o input para
  //   a altura inicial.

  ajustarAlturaInput();

  //   Isso faz o teclado virtual fechar automaticamente no celular.

  chatInput.blur();
}

/* =====================================================
   BOTÃO ENVIAR
===================================================== */

btnEnviar.addEventListener("click", enviarMensagem);

/* =====================================================
   DIGITAÇÃO
   -----------------------------------------------------
   Sempre que o usuário digitar,
   recalculamos a altura.
===================================================== */

chatInput.addEventListener("input", ajustarAlturaInput);

/* =====================================================
   ENTER PARA ENVIAR (APENAS DESKTOP)
   -----------------------------------------------------
   No Desktop: Enter envia, Shift+Enter quebra linha.
   No Mobile: Enter apenas quebra linha (melhor acessibilidade).
===================================================== */
chatInput.addEventListener(
    "keydown",
    (event) => {

        // Se a tela for de mobile (menor ou igual a 768px), ignora o envio com Enter
        // e deixa o teclado do celular quebrar linha nativamente.
        if (window.innerWidth <= 768) {
            return; 
        }

        if(
            event.key === "Enter" &&
            !event.shiftKey
        ){
            /*
              Impede quebra de linha no desktop.
            */
            event.preventDefault();

            enviarMensagem();
        }
    }
);

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

/*
  Garante que o campo comece
  com a altura correta.
*/
ajustarAlturaInput();

/* =====================================================
   CONTROLE INTEGRADO DO TECLADO VIRTUAL MÓVEL
   -----------------------------------------------------
   Mapeia o Visual Viewport real, impedindo o sumiço do
   header global e colando o input acima do teclado.
===================================================== */
if (window.visualViewport) {
  const gerenciarAjusteTeclado = () => {
    const alturaVisual = window.visualViewport.height;
    const alturaJanelaInterna = window.innerHeight;

    // Passa a altura exata da área livre visível para o CSS
    document.body.style.setProperty(
      "--visual-viewport-height",
      `${alturaVisual}px`,
    );

    // Se a altura visual cair significativamente (cerca de 15% ou mais), o teclado subiu
    if (alturaVisual < alturaJanelaInterna * 0.85) {
      document.body.classList.add("teclado-aberto");

      // Faz um micro-scroll suave para garantir que o chat mostre a última mensagem
      setTimeout(() => {
        if (chatMensagens) {
          chatMensagens.scrollTop = chatMensagens.scrollHeight;
        }
      }, 80);
    } else {
      document.body.classList.remove("teclado-aberto");
    }
  };

  // Escuta tanto redimensionamento quanto rolagem sutil provocada por foco nativo (iOS)
  window.visualViewport.addEventListener("resize", gerenciarAjusteTeclado);
  window.visualViewport.addEventListener("scroll", gerenciarAjusteTeclado);

  // Dispara no carregamento inicial para mapear a área correta
  gerenciarAjusteTeclado();
}
