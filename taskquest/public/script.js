const lista = document.getElementById("listaItems");

async function carregarItems() {
  const resposta = await fetch("http://localhost:3000/items");
  const inputNome = document.getElementsById("nomeItem");
  const inputRaridade = document.getElementById("raridadeItem");
  const btnAdicionar = document.getElementById("btnAdicionar");

  const dados = await resposta.json();
  listarItems.innerHTML = "";

  dados.forEach((item) => {
    const elementoNovo = document.createElement("p");

    elementoNovo.innerText = `${item.nome} - Raridade: ${item.raridade}`;

    lista.appendChild(elementoNovo);
  });
  window.addEventListener("DOMContentLoaded", carregarItens);
}
