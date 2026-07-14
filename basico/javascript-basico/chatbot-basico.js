/* =====================================================
   CHATBOT VISUAL
   -----------------------------------------------------
   Responsável por exibir mensagens enviadas pelo
   usuário na tela.
===================================================== */

const chatInput =
document.getElementById("chatInput");

const btnEnviar =
document.getElementById("btnEnviar");

const chatMensagens =
document.getElementById("chatMensagens");

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
    const novaAltura =
    Math.min(
        chatInput.scrollHeight,
        alturaMaxima
    );

    /*
      Aplica a nova altura.
    */
    chatInput.style.height =
    novaAltura + "px";

    /*
      Se ultrapassar o limite,
      ativa scroll interno.
    */
    if(chatInput.scrollHeight > alturaMaxima){

        chatInput.style.overflowY =
        "auto";

    }else{

        chatInput.style.overflowY =
        "hidden";
    }

}

/* =====================================================
   CRIAR MENSAGEM
===================================================== */

function criarMensagem(texto, classe) {

    const mensagem =
    document.createElement("div");

    mensagem.classList.add(
        "mensagem",
        classe
    );

    mensagem.textContent = texto;

    chatMensagens.appendChild(
        mensagem
    );

    /*
      Faz a conversa acompanhar
      automaticamente a última mensagem.
    */
    chatMensagens.scrollTop =
    chatMensagens.scrollHeight;
}

/* =====================================================
   ENVIAR MENSAGEM
===================================================== */

function enviarMensagem() {

    const texto =
    chatInput.value.trim();

    /*
      Impede envio vazio.
    */
    if(texto === "") return;

    /*
      Cria a mensagem do usuário.
    */
    criarMensagem(
        texto,
        "usuario"
    );

    /*
      Limpa o campo.
    */
    chatInput.value = "";

    /*
      Retorna o input para
      a altura inicial.
    */
    ajustarAlturaInput();
}

/* =====================================================
   BOTÃO ENVIAR
===================================================== */

btnEnviar.addEventListener(
    "click",
    enviarMensagem
);

/* =====================================================
   DIGITAÇÃO
   -----------------------------------------------------
   Sempre que o usuário digitar,
   recalculamos a altura.
===================================================== */

chatInput.addEventListener(
    "input",
    ajustarAlturaInput
);

/* =====================================================
   ENTER PARA ENVIAR
   -----------------------------------------------------
   Enter = envia

   Shift + Enter = quebra linha
===================================================== */

chatInput.addEventListener(
    "keydown",
    (event) => {

        if(
            event.key === "Enter" &&
            !event.shiftKey
        ){

            /*
              Impede quebra de linha.
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

const nav = document.querySelector("nav");

function ajustarNav() {
    if (!window.visualViewport) return;

    const tecladoAberto =
        window.innerHeight - window.visualViewport.height > 150;

    if (tecladoAberto) {
        nav.style.display = "none";
    } else {
        nav.style.display = "block";
    }
}

if (window.visualViewport) {
    visualViewport.addEventListener("resize", ajustarNav);
    visualViewport.addEventListener("scroll", ajustarNav);
}

ajustarNav();
