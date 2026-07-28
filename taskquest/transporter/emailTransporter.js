const nodemailer = require("nodemailer");
const { getDb } = require("../database.js");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function enviarEmailAutenticacao(emailDestino, acesstoken) {
  const mailOptions = {
    from: `"RPG do Jota" <${process.env.GMAIL_USER}>`,
    to: emailDestino,
    subject: "Faça o login com sua conta no RPG do Jota",
    text: `Acesse o link para realizar o login: http://localhost:3000/autenticar-token?token=${acesstoken}`,
    html: `<p>Acesse o link para realizar o login: <a href="http://localhost:3000/autenticar-token?token=${acesstoken}">Entrar no RPG</a></p>`,
  };
  return await transporter.sendMail(mailOptions);
}

module.exports = { enviarEmailAutenticacao };
