const inventario = [];

//Essa função controla o que vai acontecer quando alguém pedir os items.
const listarItems = (req, res) => {
  res.json(inventario);
};

const receberItems = (req, res) => {
  const nomeItem = req.body.nome;
  const qtdItem = req.body.quantidade;

  const novoItem = {
    nome: nomeItem,
    quantidade: qtdItem,
  };
  inventario.push(novoItem);

  res.send(
    `Você adicionou com sucesso: ${qtdItem}x ${nomeItem} ao seu inventário!`,
  );
};

//Deixa a função listarItems pública podendo exportar para outros arquivos.
module.exports = {
  listarItems,
  receberItems,
};
