const emailTexto = document.getElementById("emailSAGA");
const btnCopiar = document.getElementById("btn-copy");
const feedback = document.getElementById("msgSucesso");

btnCopiar.addEventListener('click', async () => {

    const email = emailTexto.innerText;

    try {

        await navigator.clipboard.writeText(email);
        
        feedback.innerText = "E-mail copiado com sucesso!";

    } catch (err) {

        feedback.innerText = "Falha ao copiar. Tente novamente.";
        feedback.style.color = "red";
        console.error('Erro ao copiar: ', err);
    } finally {
    // Espera 2 segundos e limpa o texto
    setTimeout(() => { feedback.innerText = ""; }, 2000);
}
});


/* =====================================================
   ENCERRAR SESSÃO
   -----------------------------------------------------
   Avisa a API (logout), remove o token do navegador e
   volta para a tela de login.
===================================================== */
const btnSair = document.getElementById("btnSair");

btnSair.addEventListener("click", async () => {

    try {

        await chamarApi("/auth/logout", "POST");

    } catch (err) {

        // Mesmo que a API falhe, a sessão é encerrada aqui no navegador
        console.error("Erro ao avisar o logout para a API: ", err);

    }

    limparSessao();

    window.location.href = "../index.html";

});
