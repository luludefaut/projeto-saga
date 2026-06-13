document.addEventListener("DOMContentLoaded", function () {
  const relatorios = JSON.parse(localStorage.getItem("meusRelatorios")) || [];

  const containerHistorico = document.getElementById("containerHistorico");

  const conteudoPrincipal = document.querySelector(".conteudo-principal");
  const menuCentralHistorico = document.getElementById("frontalmenuelem");
  const linkHistorico = document.getElementById("link-historico-completo");

  const historico = relatorios.filter((rel) => {
    return rel.status === "finalizado";
  });

  historico.forEach((rel) => {
    const card = document.createElement("div");

    card.className = "card-relatorio";

    const dataFormatada = rel.data
      ? rel.data.split("-").reverse().join("/")
      : "N/A";

    card.innerHTML = `
<div class="card-header">

<h3>${rel.tipoRelatorio}</h3>

<span class="status-tag finalizado">
FINALIZADO
</span>

</div>

<div class="card-body">

<p>
<strong>Turma:</strong>
${rel.turma}
</p>

<p>
<strong>Curso:</strong>
${rel.curso}
</p>

<p class="descricao-card">
${rel.descricao}
</p>

</div>

<div class="card-footer">

<button
class="btn-visualizar"
data-id="${rel.id}"
>

Visualizar

</button>

</div>
`;

    containerHistorico.appendChild(card);
  });

  function mostrarErroAcessoHistorico() {
    //Esconde o css e toda a tela de erro quando não clicado no link
    if (menuCentralHistorico) {
      menuCentralHistorico.style.display = "none";
    }

    const caixaErro = document.createElement("div");
    caixaErro.className = "erro-basico-container";

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
    linkHistorico.addEventListener("click", function (event) {
      event.preventDefault();
      mostrarErroAcessoHistorico();
    });
  }
});

document.addEventListener("click",(e)=>{    

if(!e.target.classList.contains("btn-visualizar"))
return;

const id =
Number(
e.target.dataset.id
);

const relatorios =
JSON.parse(
localStorage.getItem("meusRelatorios")
) || [];

const relatorio =
relatorios.find(
r => r.id === id
);

const modal =
document.getElementById(
"modalVisualizarRelatorio"
);

const conteudo =
document.getElementById(
"conteudoRelatorioCompleto"
);

conteudo.innerHTML = "";

Object.entries(relatorio)
.forEach(([campo,valor])=>{

conteudo.innerHTML += `
<p>
<strong>${campo}</strong>:
${valor}
</p>
`;

});

modal.showModal();

});
