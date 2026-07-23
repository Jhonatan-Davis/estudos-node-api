const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

let db;

async function initDb() {
  if (db) return db;

  db = await open({
    filename: "./banco.bd",
    driver: sqlite3.Database,
  });

  await db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE NOT NULL,
        telefone TEXT,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL
        )
        `);

  await db.exec(`
        CREATE TABLE IF NOT EXISTS quests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        recompensa TEXT NOT NULL,
        concluido BOOLEAN NOT NULL DEFAULT 0,
        usuario_id INTEGER,
        item_id INTEGER,
        FOREIGN KEY (item_id) REFERENCES inventario(id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )
        `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS inventario(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_item TEXT NOT NULL,
    raridade TEXT NOT NULL,
    usuario_id INTEGER,
    quests_id INTEGER,
    FOREIGN KEY (quests_id) REFERENCES inventario(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
    `);

  console.log("Banco de dados SQLite inicializado com sucesso!");
  return db;
}

function getDb() {
  return db;
}

module.exports = { initDb, getDb };
