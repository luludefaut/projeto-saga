/* =====================================================
   ACCORDION DO HISTÓRICO
   -----------------------------------------------------
   Permite abrir apenas um relatório por vez.
   Ao clicar em outro relatório, o anterior é fechado.
===================================================== */

// Seleciona todos os accordions da página
const accordions =
document.querySelectorAll(".accordion-item");

// Percorre cada accordion encontrado
accordions.forEach(item => {

  // Captura o cabeçalho clicável
  const header =
  item.querySelector(".accordion-header");

  // Evento responsável por abrir e fechar
  header.addEventListener("click", () => {

    // Fecha todos os accordions,
    // exceto o que foi clicado
    accordions.forEach(outro => {

      if(outro !== item){
        outro.classList.remove("active");
      }

    });

    // Alterna o estado do accordion atual
    item.classList.toggle("active");

  });

});