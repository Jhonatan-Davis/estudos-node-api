const bcrypt = require("bcrypt");
const { getDb } = require("../database.js");

const cadastro = async (req, res) => {
  try {
    const db = getDb();
    const { nome, email, senha, telefone } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Preencha todos os campos obrigatórios!" });
    }

    const existe = await db.get("SELECT id FROM usuarios WHERE email = ?", [
      email,
    ]);
    if (existe) {
      return res.status(400).json({ error: "Esse e-mail já foi registrado!" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const resultado = await db.run(
      `INSERT INTO usuarios (nome, telefone, email, senha) VALUES (?, ?, ?, ?)`,
      [nome, telefone || null, email, senhaHash],
    );

    res.status(201).json({
      message: "Usuário registrado com sucesso!",
      id: resultado.lastID,
    });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(500).json({ error: "Erro interno no servidor ao cadastrar." });
  }
};

const login = async (req, res) => {
  try {
    const db = getDb();
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: "Preencha e-mail e senha!" });
    }

    const usuario = await db.get("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);

    if (!usuario) {
      return res.status(401).json({ message: "E-mail ou senha incorretos!" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ message: "E-mail ou senha incorretos!" });
    }

    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    };

    res.status(200).json({ message: "Login bem-sucedido!" });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Erro ao sair." });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout realizado!" });
  });
};

module.exports = {
  cadastro,
  login,
  logout,
};
