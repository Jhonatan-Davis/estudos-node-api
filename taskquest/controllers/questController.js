const fs = require("fs");
const caminhoItem = "./items.json";
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

  if (!tituloQuest || !recompensaQuest) {
    return res.send(
      `Por favor Adicione um titulo e uma recompensa para essa Quest!!`,
    );
  }
  guildaQuests.push(novaQuest);

  fs.writeFileSync(caminhoArquivo, JSON.stringify(guildaQuests, null, 2));

  res.send(`Foi adicionada a nova Quest na lista de Quests com o titúlo de
     ${tituloQuest}, com a recompensa de ${recompensaQuest} `);
};

const deletarQuest = (req, res) => {
  const deletarTitulo = req.body.titulo;
  const dadosAtuais = fs.readFileSync(caminhoArquivo, "utf-8");
  const guildaQuest = JSON.parse(dadosAtuais);

  const listaAtualizada = guildaQuest.filter(
    (quest) => quest.titulo !== deletarTitulo,
  );

  fs.writeFileSync(caminhoArquivo, JSON.stringify(listaAtualizada, null, 2));

  res.send(`A quest "${deletarTitulo}" foi removida com sucesso da guilda!`);
};

const alterarQuest = (req, res) => {
  const alterarTitulo = req.body.titulo;
  const novoTitulo = req.body.novoTitulo;
  const novaRecompensa = req.body.novaRecompensa;
  const concluirQuest = req.body.concluido;
  let mensagem = "";

  const alterarQuest = {
    novoTitulo: novoTitulo,
    novaRecompensa: novaRecompensa,
    concluido: concluirQuest,
  };

  const dadosAtuais = fs.readFileSync(caminhoArquivo, "utf-8");
  const guildaQuest = JSON.parse(dadosAtuais);

  const questEncontrada = guildaQuest.find(
    (quest) => quest.titulo === alterarTitulo,
  );

  if (questEncontrada) {
    if (concluirQuest) {
      questEncontrada.concluido = true;

      const dadosItems = fs.readFileSync(caminhoItem, "utf-8");
      const guildaItem = JSON.parse(dadosItems);
      const nomeDaRecompensa = questEncontrada.recompensa;

      const novoItem = {
        recompensa: nomeDaRecompensa,
        raridade: "raro",
      };
      guildaItem.push(novoItem);
      fs.writeFileSync(caminhoItem, JSON.stringify(guildaItem, null, 2));

      mensagem += `\n O status da Quest de título ${alterarTitulo}, foi alterado para concluído e a sua recompensa já foi adicionada ao seu inventário!`;
    }

    if (novoTitulo) {
      questEncontrada.titulo = novoTitulo;
      mensagem += `\n O título mudou para "${novoTitulo}".`;
    }
    if (novaRecompensa) {
      questEncontrada.recompensa = novaRecompensa;
      mensagem += `\n A recompensa mudou para "${novaRecompensa}".`;
    }
    fs.writeFileSync(caminhoArquivo, JSON.stringify(guildaQuest, null, 2));
  } else {
    mensagem += `\n Não foi possível alterar a Quest!`;
  }

  res.send(mensagem);
};

module.exports = {
  listarQuests,
  adicionarQuest,
  deletarQuest,
  alterarQuest,
};
