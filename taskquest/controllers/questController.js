const fs = require("fs");
const caminhoArquivo = "./quests.json";

const listarQuests = (req, res) => {
  const dadosArquivo = fs.readFileSync(caminhoArquivo, "utf-8");

  const guildaQuests = JSON.parse(dadosArquivo);
  res.json(guildaQuests);
};

const adicionarQuest = (req, res) => {
  const tituloQuest = req.body.titulo;
  const recompensaQuest = req.body.recompensa;

  const novaQuest = {
    titulo: tituloQuest,
    recompensa: recompensaQuest,
  };
  const dadosAtuais = fs.readFileSync(caminhoArquivo, "utf8");
  const guildaQuests = JSON.parse(dadosAtuais);

  guildaQuests.push(novaQuest);

  fs.writeFileSync(caminhoArquivo, JSON.stringify(guildaQuests, null, 2));

  res.send(`Foi adicionada a nova Quest na lista de Quests com o titúlo de
     ${tituloQuest}, com a recompensa de ${recompensaQuest} `);
};

const deletarQuest = (req, res) => {};

module.exports = {
  listarQuests,
  adicionarQuest,
};
