document.addEventListener('DOMContentLoaded', function() {

    const chatContainer = document.querySelector('.chat');
    const menuCentral = document.getElementById('frontalmenuelemchat');


    function mostrarErroAcesso() {
        //funcionalidade para esconder a mensagem de erro
        if (menuCentral) {
            menuCentral.style.display = 'none';
        }

        // Cria a estrutura do erro premium
        const caixaErro = document.createElement('div');
        caixaErro.className = 'erro-basico-container';
        //Adiciona o item e seu texto contido no formato de tags htmls adicionando uma div e h2
        caixaErro.innerHTML = `
            <div class="erro-emoji">☹</div>
            <h2>Desculpe. Você não tem acesso ao ChatBot!</h2>
            <a href="#" class="btn-premium">Atualize para o Premium.</a>
        `;


        if (chatContainer) {
            chatContainer.appendChild(caixaErro);
        }
    }


    mostrarErroAcesso();
});