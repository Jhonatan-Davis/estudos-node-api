const express = require("express");
const app = express();
const cors = require("cors");
const { initDb } = require("./database.js");

const questController = require("./controllers/questController");
const itemController = require("./controllers/itemController");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/items", itemController.listarItems);
app.post("/items", itemController.receberItems);
app.delete("/items/:id", itemController.deletarItem);
app.put("/items/:id", itemController.alterarItem);
app.patch("/items/:id", itemController.alterarItem);

app.get("/quests", questController.listarQuests);
app.post("/quests", questController.adicionarQuest);
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
