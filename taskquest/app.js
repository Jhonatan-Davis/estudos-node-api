const express = require("express");
const app = express();
const questController = require("./controllers/questController");
const itemController = require("./controllers/itemController");

app.use(express.json());
app.use(express.static("public"));

app.get("/items", itemController.listarItems);
app.post("/items", itemController.receberItems);
app.delete("/items", itemController.deletarItem);
app.put("/items", itemController.alterarItem);
app.patch("/items", itemController.alterarItem);

app.get("/quests", questController.listarQuests);
app.post("/quests", questController.adicionarQuest);

app.delete("/quests", questController.deletarQuest);

app.put("/quests/:id", questController.alterarQuest);
app.patch("/quests", questController.alterarQuest);

app.listen(3000, () => {
  console.log("O servidor está configurado no http://localhost:3000");
});
