/* =====================================================
   GUARDA.JS
   -----------------------------------------------------
   Barra quem não está logado de ver as páginas internas.

   Fica no <head> de cada página (logo depois do api.js), por
   isso roda ANTES da página aparecer: quem digitar o endereço
   direto no navegador é mandado para o login sem ver nada.
===================================================== */

// Sem token (ou token vencido): vai para o login
exigirLogin();

// Quando o usuário volta pelo botão "voltar" do navegador, a página pode
// vir do cache sem rodar o código de novo (ex: depois de encerrar a sessão).
// Por isso conferimos o login mais uma vez nesse caso.
window.addEventListener("pageshow", (evento) => {
  if (evento.persisted) exigirLogin();
});
