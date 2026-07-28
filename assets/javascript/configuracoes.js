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