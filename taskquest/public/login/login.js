const formLogin = document.getElementById("formLogin");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("senha");

async function realizarLogin(event) {
  event.preventDefault();

  const email = inputEmail.value;
  const senha = inputSenha.value;

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  try {
    const resposta = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },

      body: JSON.stringify({ email, senha }),
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      alert("Login realizado com sucesso!");

      window.location.href = "../quests.html";
    } else {
      alert(dados.message || "Email ou senha incorretos.");
    }
  } catch (error) {
    console.error("Erro ao conectar com o servidor: ", error);
    alert("Não foi possível conectar ao servidor.");
  }
}

formLogin.addEventListener("submit", realizarLogin);
