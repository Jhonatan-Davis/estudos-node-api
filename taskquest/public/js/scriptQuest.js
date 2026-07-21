const lista = document.getElementById("listaQuests");
const tituloQuest = document.getElementById("inputTitulo");
const recompensaQuest = document.getElementById("inputRecompensa");
const botaoCadastro = document.getElementById("btnCadastrar");

async function listarQuests() {
  const resposta = await fetch("http://localhost:3000/quests");
  const dados = await resposta.json();

  lista.innerHTML = "";

  dados.forEach((quest) => {
    const elementoNovo = document.createElement("div");
    elementoNovo.classList.add("quest-card");

    const divConteudo = document.createElement("div");
    divConteudo.classList.add("quest-conteudo");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = quest.concluido;

    const textoQuest = document.createElement("span");
    textoQuest.innerText = `${quest.titulo} - Recompensa: ${quest.recompensa}`;

    if (quest.concluido) {
      textoQuest.style.textDecoration = "line-through";
      textoQuest.style.opacity = "0.6";
      checkbox.style.accentColor = "#c8aa6e";
      checkbox.style.transform = "scale(1.2)";
    }

    checkbox.addEventListener("change", async () => {
      const resposta = await fetch(`http://localhost:3000/quests/${quest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: quest.titulo,
          concluido: checkbox.checked,
        }),
      });

      const mensagem = await resposta.text();
      alert(mensagem);

      listarQuests();
    });

    divConteudo.appendChild(checkbox);
    divConteudo.appendChild(textoQuest);

    const btnDeletar = document.createElement("button");
    btnDeletar.classList.add("btn-deletar");

    const iconeLixeira = document.createElement("i");
    iconeLixeira.className = "bi bi-trash";

    btnDeletar.appendChild(iconeLixeira);

    btnDeletar.addEventListener("click", async () => {
      if (confirm(`Deseja realmente excluir a quest "${quest.titulo}"?`)) {
        const resposta = await fetch("http://localhost:3000/quests", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titulo: quest.titulo,
          }),
        });

        const mensagem = await resposta.text();
        alert(mensagem);

        listarQuests();
      }
    });

    elementoNovo.appendChild(divConteudo);
    elementoNovo.appendChild(btnDeletar);

    lista.appendChild(elementoNovo);
  });
}

window.addEventListener("DOMContentLoaded", listarQuests);

async function adicionarQuest() {
  const tituloDigitado = tituloQuest.value;
  const recompensaDigitada = recompensaQuest.value;

  const resposta = await fetch("http://localhost:3000/quests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      titulo: tituloDigitado,
      recompensa: recompensaDigitada,
    }),
  });

  const mensagemDoServidor = await resposta.text();
  alert(mensagemDoServidor);

  tituloQuest.value = "";
  recompensaQuest.value = "";
  listarQuests();
}

if (botaoCadastro) {
  botaoCadastro.addEventListener("click", adicionarQuest);
}
