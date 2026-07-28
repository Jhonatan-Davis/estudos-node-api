const express = require("express");
require("dotenv").config();
const session = require("express-session");
const bcrypt = require("bcrypt");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const { initDb } = require("./database.js");
const nodemailer = require("nodemailer");
const { verifyAcessToken } = require("./utils/jwt.js");

const emailTransporter = require("./transporter/emailTransporter");
const questController = require("./controllers/questController");
const itemController = require("./controllers/itemController");
const authController = require("./controllers/authController");

const { enviarEmailAutenticacao } = require("./transporter/emailTransporter");
const { gerarTokenAcesso } = require("./utils/jwt");

app.post("/solicitar-login", async (req, res) => {
  const { email } = req.body;

  const acesstoken = gerarTokenAcesso({ email });

  try {
    await enviarEmailAutenticacao(email, acesstoken);
    res.send({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Erro ao enviar e-mail" });
  }
});

const app = express();

app.use(
  session({
    secret: "qwertyuiop",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 },
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 },
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

function autenticar(req, res, next) {
  if (req.session.usuario) {
    return next();
  }

  res.status(401).send({ message: "Não autorizado" });
}

app.get("/autenticar-token", (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Token não fornecido.");
  }

  const dadosDecodificados = verifyAcessToken(token);

  if (!dadosDecodificados) {
    return res
      .status(401)
      .send("O link expirou ou é inválido. Solicite um novo.");
  }

  req.session.usuario = { email: dadosDecodificados.email };

  res.redirect("/index.html");
});

app.post("/cadastro", authController.cadastro);

app.post("/login", authController.login);
app.post("/logout", authController.logout);

app.get("/items", autenticar, itemController.listarItems);
app.post("/items", autenticar, itemController.receberItems);
app.delete("/items/:id", itemController.deletarItem);
app.put("/items/:id", itemController.alterarItem);
app.patch("/items/:id", itemController.alterarItem);

app.get("/quests", autenticar, questController.listarQuests);
app.post("/quests", autenticar, questController.adicionarQuest);
app.delete("/quests/:id", questController.deletarQuest);
app.put("/quests/:id/status", questController.alternarStatusQuest);
app.patch("/quests/:id/status", questController.alternarStatusQuest);

initDb()
  .then(() => {
    app.listen(3000, () => {
      console.log("🚀 Servidor rodando em http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Erro ao iniciar o banco de dados:", err);
  });
