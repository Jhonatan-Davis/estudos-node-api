const { getDb } = require("../database.js");

const listarQuests = async (req, res) => {
  try {
    const db = getDb();
    const quests = await db.all("SELECT * FROM quests");
    res.json(quests);
  } catch (error) {
    console.error("ERRO REAL DO SQLITE: ", error);
    res.status(500).send(`Erro interno: ${error.message}`);
  }
};

const adicionarQuest = async (req, res) => {
  try {
    const db = getDb();
    const { titulo, recompensa } = req.body;

    const adicionar = await db.run(
      `
      INSERT INTO quests (titulo, recompensa) VALUES (?, ?)`,
      [titulo, recompensa],
    );

    res.status(201).send("Quest cadastrada com sucesso!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao inserir os dados");
  }
};

const deletarQuest = async (req, res) => {
  try {
    const db = getDb();
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).send("ID inválido fornecido.");
    }

    const resultado = await db.run("DELETE FROM quests WHERE id = ?", [id]);

    if (resultado.changes === 0) {
      return res.status(404).send(`Nenhuma quest encontrada com o ID ${id}.`);
    }

    res.status(200).send("Quest excluida com sucesso!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Não foi possível apagar a quest!");
  }
};

const alterarQuest = async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { titulo } = req.body;
    const questAntiga = await db.get("SELECT * FROM quests WHERE id = ?", [id]);

    if (!questAntiga) {
      return res.status(404).send("Quest não encontrada!");
    }

    const novoTitulo = titulo !== undefined ? titulo : questAntiga.titulo;
    const novaRecompensa =
      recompensa !== undefined ? recompensa : questAntiga.recompensa;

    let novoConcluido;
    if (concluido !== undefined) {
      novoConcluido = concluido ? 1 : 0;
    } else {
      novoConcluido = questAntiga.concluido;
    }

    await db.run(
      `
      UPDATE quests SET titulo = ?, recompensa = ?, concluido = ? WHERE id =?`,
      [novoTitulo, novaRecompensa, novoConcluido, id],
    );

    res.status(200).send(`Quest atualizada com sucesso!`);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Erro interno ao atualizar`);
  }
};

const alternarStatusQuest = async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { concluido } = req.body;
    const statusNumerico = concluido ? 1 : 0;

    const resultado = await db.run(
      `UPDATE quests SET concluido = ? WHERE id = ?`,
      [statusNumerico, id],
    );

    if (resultado.changes === 0) {
      return res.status(404).send("Quest não encontrada.");
    }

    res.status(200).send("Status da quest atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao alternar status da quest:", error);
    res.status(500).send("Erro interno ao alterar o status.");
  }
};

module.exports = {
  listarQuests,
  adicionarQuest,
  deletarQuest,
  alterarQuest,
  alternarStatusQuest,
};
