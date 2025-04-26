require("dotenv").config(); // Carrega variáveis de ambiente do arquivo .env
const express = require("express");
const mongoose = require("mongoose");
require("./models/instrutoresModels");
require("./models/aulaModels");
require("./models/AlunosModels.js");
const cors = require("cors");
const helmet = require("helmet"); // Para aumentar a segurança com headers HTTP
const rateLimit = require("express-rate-limit"); // Para proteger contra ataques de força bruta

// Verificando e carregando a URI do MongoDB
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("Erro: MONGO_URI não definida no arquivo .env");
  process.exit(1);
}

// Função para conectar ao banco de dados MongoDB
async function conectarAoBanco() {
  try {
    await mongoose.connect(uri, {});
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
}

// Configuração do Express
const app = express();
app.use(express.json());
app.use(helmet()); // Adiciona segurança extra com headers HTTP
app.use(
  cors({
    origin: process.env.ORIGIN_URI, // URL do frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "userEmail"],
    credentials: true, // Permite envio de cookies e credenciais
  })
);

// Limitar requisições para proteger contra ataques de força bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: "Muitas requisições de um único IP. Tente novamente mais tarde.",
});
app.use(limiter);

// Middleware para exibir os headers da requisição (para debug)
app.use((req, res, next) => {
  console.log("Request Headers:", req.headers);
  next();
});

// Importação de rotas e middleware
const userRoutes = require("./routes/userRoutes.js");
const alunosRoutes = require("./routes/alunosRoutes.js");
const aulasRoutes = require("./routes/aulaRoutes.js");
const instrutorRoutes = require("./routes/instrutoresRoutes.js");

// Definição de rotas
app.use("/api/user", userRoutes); // Rota pública de usuários
app.use("/api/alunos", alunosRoutes);
app.use("/api/aula", aulasRoutes);
app.use("/api/instrutores", instrutorRoutes);

// Teste de status do servidor
const authenticateToken = require("./middleware/authJWT");
app.use("/api/user", authenticateToken, userRoutes); // Rota protegida de usuário
app.get("/", (req, res) => {
  res.status(200).send("Servidor rodando com sucesso!");
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err);
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.status(500).json({ message: "Erro interno do servidor." });
});

// Início do servidor
const PORT = process.env.PORT;
app.listen(PORT, async () => {
  await conectarAoBanco();
  console.log(`Servidor rodando na porta ${PORT}`);
});
