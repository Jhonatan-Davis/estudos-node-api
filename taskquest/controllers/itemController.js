const fs = require("fs");
const { parse } = require("path");
const caminhoDados = "./items.json";

const listarItems = (req, res) => {
  const arquivosDados = fs.readFileSync(caminhoDados, "utf-8");
  const guildaItems = JSON.parse(arquivosDados);

  res.json(guildaItems);
};

const receberItems = (req, res) => {
  const nomeItem = req.body.nome;
  const raridadeItem = req.body.raridade;
  const novoItem = {
    nome: nomeItem,
    raridade: raridadeItem,
  };

  const arquivosDados = fs.readFileSync(caminhoDados, "utf-8");
  const guildaItems = JSON.parse(arquivosDados);

  if (!nomeItem || !raridadeItem) {
    return res.send(`Cadastre o nome e a raridade do item ao inventário`);
  }
  guildaItems.push(novoItem);
  fs.writeFileSync(caminhoDados, JSON.stringify(guildaItems, null, 2));

  res.send(
    `Você adicionou com sucesso, ${nomeItem} de raridade: "${raridadeItem}" ao seu inventário!`,
  );
};

const deletarItem = (req, res) => {
  const itemDeletado = req.body.nome;

  const arquivosDados = fs.readFileSync(caminhoDados, "utf-8");
  const guildaItems = JSON.parse(arquivosDados);

  const listaAtualizada = guildaItems.filter(
    (items) => items.nome != itemDeletado,
  );
  fs.writeFileSync(caminhoDados, JSON.stringify(listaAtualizada, null, 2));
  res.send(`O item ${itemDeletado} foi deletado com sucesso!`);
};

const alterarItem = (req, res) => {
  const nome = req.body.nome;
  const novoNome = req.body.novoNome;
  const novaRaridade = req.body.novaRaridade;
  let mensagem = "";

  const arquivosDados = fs.readFileSync(caminhoDados, "utf-8");
  const guildaItems = JSON.parse(arquivosDados);

  const alterarItem = {
    novoNome: novoNome,
    novaRaridade: novaRaridade,
  };

  const itemEncontrado = guildaItems.find((items) => items.nome === nome);

  if (itemEncontrado) {
    if (novoNome) {
      itemEncontrado.nome = novoNome;
      mensagem += `\n O nome do item foi alterado para ${novoNome}`;
    }
    if (novaRaridade) {
      itemEncontrado.raridade = novaRaridade;
      mensagem += `\n A raridade do item foi alterada para ${novaRaridade}`;
    }
    fs.writeFileSync(caminhoDados, JSON.stringify(guildaItems, null, 2));
  } else {
    mensagem += `Não foi possível encontrar o item selecionado, ${nome}`;
  }
  res.send(mensagem);
};

module.exports = {
  listarItems,
  receberItems,
  deletarItem,
  alterarItem,
};
