const express = require("express");
const app = express();
const questController = require("./controllers/questController");
const itemController = require("./controllers/itemController");

app.use(express.json());

app.get("/items", itemController.listarItems);
app.post("/items", itemController.receberItems);

app.get("/quests", questController.listarQuests);
app.post("/quests", questController.adicionarQuest);

app.listen(3000, () => {
  console.log("O servidor está configurado no http://localhost:3000");
});
