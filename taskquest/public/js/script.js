const lista = document.getElementById("listaItems");
const inputNome = document.getElementById("nomeItem");
const inputRaridade = document.getElementById("raridadeItem");
const btnAdicionar = document.getElementById("btnAdicionar");

async function carregarItems() {
  const resposta = await fetch("http://localhost:3000/items");
  const inputNome = document.getElementById("nomeItem");
  const inputRaridade = document.getElementById("raridadeItem");
  const btnAdicionar = document.getElementById("btnAdicionar");

  const dados = await resposta.json();
  lista.innerHTML = "";

  dados.forEach((item) => {
    const elementoNovo = document.createElement("p");

    elementoNovo.innerText = `${item.nome} - Raridade: ${item.raridade}`;

    lista.appendChild(elementoNovo);
  });
}

window.addEventListener("DOMContentLoaded", carregarItems);

async function adicionarItem() {
  const nomeItemDigitado = inputNome.value;
  const raridadeItemDigitada = inputRaridade.value;

  const resposta = await fetch("http://localhost:3000/items", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      nome: nomeItemDigitado,
      raridade: raridadeItemDigitada,
    }),
  });

  const mensagemDoServidor = await resposta.text();
  alert(mensagemDoServidor);

  inputNome.value = "";
  inputRaridade.value = "";
  carregarItems();
}

btnAdicionar.addEventListener("click", adicionarItem);
