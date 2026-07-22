const lista = document.getElementById("listaItems");
const inputNome = document.getElementById("nomeItem");
const inputRaridade = document.getElementById("raridadeItem");
const btnAdicionar = document.getElementById("btnAdicionar");

async function carregarItems() {
  try {
    const resposta = await fetch("http://localhost:3000/items");

    const lista = document.getElementById("listaItems");
    const dados = await resposta.json();

    lista.innerHTML = "";

    dados.forEach((item) => {
      const elementoNovo = document.createElement("div");
      elementoNovo.classList.add("item-card");

      const divConteudo = document.createElement("div");
      divConteudo.classList.add("item-conteudo");

      const textoItem = document.createElement("span");
      textoItem.innerText = `${item.nome_item} - Raridade: ${item.raridade}`;

      divConteudo.appendChild(textoItem);

      const btnDeletar = document.createElement("button");
      btnDeletar.classList.add("btn-deletar");

      const iconeLixeira = document.createElement("i");
      iconeLixeira.className = "bi bi-trash";

      btnDeletar.appendChild(iconeLixeira);

      btnDeletar.addEventListener("click", async () => {
        if (confirm(`Deseja realmente excluir o item "${item.nome_item}"?`)) {
          try {
            const resposta = await fetch(
              `http://localhost:3000/items/${item.id}`,
              {
                method: "DELETE",
              },
            );
            if (resposta.ok) {
              carregarItems();
            } else {
              alert("Erro ao deletar o item no servidor.");
            }
          } catch (error) {
            console.error("Erro ao deletar quest:", error);
          }
        }
      });

      elementoNovo.appendChild(divConteudo);
      elementoNovo.appendChild(btnDeletar);
      lista.appendChild(elementoNovo);
    });
  } catch (error) {
    console.error("Erro ao carregar itens:", error);
  }
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
  inputNome.value = "";
  inputRaridade.value = "";
  carregarItems();
}

btnAdicionar.addEventListener("click", adicionarItem);
