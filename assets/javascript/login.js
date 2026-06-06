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