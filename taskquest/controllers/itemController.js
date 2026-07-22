const { getDb } = require("../database.js");

const listarItems = async (req, res) => {
  try {
    const db = getDb();
    const lista = await db.all("SELECT * FROM inventario");
    res.json(lista);
  } catch (error) {
    console.error("Erro interno SQLite: ", error);
    res.status(500).send("Erro interno do servidor!");
  }
};

const receberItems = async (req, res) => {
  try {
    const db = getDb();
    const { nome, raridade } = req.body;
    const adicionar = await db.run(
      `
    INSERT INTO inventario (nome_item, raridade) VALUES (?, ?)`,
      [nome, raridade],
    );

    res.status(201).send("Item adicionado ao inventario!!");
  } catch (error) {
    console.error("Erro interno SQLite: ", error);
    res.status(500).send("Erro interno do servidor!");
  }
};

const deletarItem = async (req, res) => {
  try {
    const db = getDb();
    const id = Number(req.params.id);
    const deletar = await db.run(`DELETE FROM inventario WHERE id = ?`, [id]);

    res.status(200).send("O item foi deletado com sucesso!");
  } catch (error) {
    console.error("Erro interno SQLite: ", error);
    res.status(500).send("Erro interno do servidor!");
  }
};

const alterarItem = async (req, res) => {
  try {
    const db = getDb();
    const id = Number(req.params.id);
    const { nome, raridade } = req.body;
    const itemAntigo = await db.get("SELECT * FROM inventario WHERE id = ?", [
      id,
    ]);

    if (!itemAntigo) {
      return res.status(404).send("Item não encontrado!");
    }

    const novoNome = nome !== undefined ? nome : itemAntigo.nome;
    const novaRaridade =
      raridade !== undefined ? raridade : itemAntigo.raridade;

    const alterar = await db.run(
      `
      UPDATE inventario SET nome_item = ?, raridade = ? WHERE id = ?`,
      [novoNome, novaRaridade, id],
    );

    res.status(200).send("O item foi alterado com sucesso no inventário!");
  } catch (error) {
    console.error("Erro interno SQLite: ", error);
    res.status(500).send("Erro interno do servidor!");
  }
};

module.exports = {
  listarItems,
  receberItems,
  deletarItem,
  alterarItem,
};
