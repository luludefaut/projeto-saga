// 1. Pegamos o formulário e o botão (apenas os elementos)
const formulario = document.getElementById('areaform');

formulario.addEventListener('submit', (event) => {
    // Evita que a página recarregue e suma com as mensagens de erro
    event.preventDefault();

    // 2. PEGANDO OS VALORES no omento do clique/envio
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    // 3. Pegando as tags <p> de erro
    const alertaEmail = document.getElementById('alertaEmail');
    const alertaSenha = document.getElementById('alertaSenha');

    // Limpa todas as mensagens de erro anteriores
    alertaEmail.textContent = "";
    alertaSenha.textContent = "";

    // Variável de controle para saber se o formulário está 100% correto
    let formularioValido = true;

    // --- VALIDAÇÃO DE CADA CAMPO ---

    // Validação do E-mail (Verifica se está vazio e se tem o @ com domínio)
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        alertaEmail.textContent = "Preencha o campo E-mail!";
        formularioValido = false;
    } else if (!regexEmail.test(email)) {
        alertaEmail.textContent = "Digite um e-mail válido (ex: nome@email.com)!";
        formularioValido = false;
    }

    // Validação da Senha (Mínimo de 8 caracteres)
    if (senha === "") {
        alertaSenha.textContent = "Preencha o campo Senha!";
        formularioValido = false;
    } else if (senha.length < 8) {
        alertaSenha.textContent = "A senha deve ter no mínimo 8 caracteres!";
        formularioValido = false;
    }

    // 4. ENVIO FINAL: Só envia se nenhuma validação acima tiver falhado
    if (formularioValido) {
        alert("Enviado com sucesso!");
        
        formulario.reset();
        // Limpa os campos após o envio
    }
});

const btnTroca = document.getElementById("troca"); // pega o id do botáo de trocar o tema


function ativarDarkMode() { // função para ativar o dark-mode e mudar os seus ícones

    document.body.classList.add("dark-mode");

    document.getElementById("logoSaga").src = "assets/icons/darkMode/logo-saga-login-blue-dark.png";

    document.getElementById("iconeTema").src = "assets/icons/darkMode/darkmode-sun-icon.svg";

    document.getElementById("iconePerfil").src = "assets/icons/darkMode/usuario-icon-dark.svg";

    document.getElementById("iconeEmail").src = "assets/icons/darkMode/login-email-icon-dark.svg";

    document.getElementById("iconeSenha").src = "assets/icons/darkMode/login-padlock-icon-dark.svg";

}

function desativarDarkMode() { // função para desativar o dark-mode e mudar os seus ícones, garantindo que eles carreguem novamente

    document.body.classList.remove("dark-mode");

    document.getElementById("logoSaga").src = "assets/icons/logo-saga-login-blue.png";

    document.getElementById("iconeTema").src = "assets/icons/darkmode-moon-icon.svg";

    document.getElementById("iconePerfil").src = "assets/icons/usuario-icon.svg";

    document.getElementById("iconeEmail").src = "assets/icons/login-email-icon.svg";

    document.getElementById("iconeSenha").src = "assets/icons/login-padlock-icon.svg";

}

btnTroca.addEventListener("click", (e) => { // verifica o click no botão

    e.preventDefault(); // impede que página recarregue

    if (document.body.classList.contains("dark-mode")) { // verifica se a class dark-mode existe

        desativarDarkMode();

    } else {

        ativarDarkMode();

    }

});