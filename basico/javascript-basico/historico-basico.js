document.addEventListener('DOMContentLoaded', function() {

    const conteudoPrincipal = document.querySelector('.conteudo-principal');
    const menuCentralHistorico = document.getElementById('frontalmenuelem');
    const linkHistorico = document.getElementById('link-historico-completo');


    function mostrarErroAcessoHistorico() {
        //Esconde o css e toda a tela de erro quando não clicado no link
        if (menuCentralHistorico) {
            menuCentralHistorico.style.display = 'none';
        }
       
        const caixaErro = document.createElement('div');
        caixaErro.className = 'erro-basico-container';
        
        //Inserção de uma estrutura nova de tags
        caixaErro.innerHTML = `
            <div class="erro-emoji">☹</div>
            <h2>Desculpe. Você não tem acesso ao Histórico Completo!</h2>
            <a href="#" class="btn-premium">Atualize para o Premium.</a>
        `;

      //inserção do erro na tag main
        if (conteudoPrincipal) {
            conteudoPrincipal.appendChild(caixaErro);
        }
    }

//Comandos que mantém o erro ativo após clique no link
    if (linkHistorico) {
        linkHistorico.addEventListener('click', function(event) {
            event.preventDefault(); 
            mostrarErroAcessoHistorico(); 
        });
    }
});