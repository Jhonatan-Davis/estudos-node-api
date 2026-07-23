const formCadastro = document.getElementById("formCadastro");
const inputNome = document.getElementById("inputName");
const inputTelefone = document.getElementById("inputTelefone");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("senha");
const inputConfirmarSenha = document.getElementById("confirmarSenha");

async function cadastrar(event) {
  event.preventDefault();

  const nome = inputNome.value;
  const telefone = inputTelefone ? inputTelefone.value : null;
  const email = inputEmail.value;
  const senha = inputSenha.value;
  const Csenha = inputConfirmarSenha.value;

  if (!nome || !senha || !email) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  if (Csenha !== senha) {
    alert("Suas senhas não correspondem!");
    return;
  }

  try {
    const resposta = await fetch("http://localhost:3000/cadastro", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ nome, telefone, email, senha }),
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      alert("Usuário cadastrado com sucesso!");
      window.location.href = "./login.html";
    } else {
      alert(dados.error || "Erro ao cadastrar.");
    }
  } catch (error) {
    console.error("Erro ao conectar com o servidor: ", error);
    alert("Não foi possível conectar ao servidor.");
  }
}

formCadastro.addEventListener("submit", cadastrar);
