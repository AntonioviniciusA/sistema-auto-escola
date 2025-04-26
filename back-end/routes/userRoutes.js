const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authenticateToken = require("../middleware/authJWT");
const { body, validationResult } = require("express-validator");
const User = require("../models/userModels");
const Instructor = require("../models/instrutoresModels");
require("dotenv").config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Rota de Registro
router.post(
  "/",
  [
    body("usuario").notEmpty().withMessage("O campo usuário é obrigatório."),
    body("levelAuth")
      .notEmpty()
      .withMessage("O campo nivel de autorizacao é obrigatório."),
    body("email").isEmail().withMessage("E-mail inválido."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("A senha deve ter pelo menos 6 caracteres."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    // Se o nível de autorização for "instrutor", cria um instrutor também

    try {
      const { usuario, email, password, levelAuth } = req.body;

      const newUser = new User({ usuario, email, password, levelAuth });
      const savedUser = await newUser.save();
      if (levelAuth === "instrutor") {
        const instructor = new Instructor({
          usuario,
          email,
        });

        await instructor.save();
      }
      res
        .status(201)
        .json({ message: "Usuário criado com sucesso!", user: savedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao adicionar o usuário." });
    }
  }
);

// Rota de Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Senha incorreta." });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login bem-sucedido!",
      token,
      user: {
        id: user._id,
        email: user.email,
        usuario: user.usuario,
        levelAuth: user.levelAuth,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro no servidor." });
  }
});

// Rota para buscar dados do usuário autenticado
router.get("/get", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado." });
    res.status(200).json(user); // Retorna os dados do usuário
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).send("Erro ao buscar os dados do usuário");
  }
});
router.get("/getall", async (req, res) => {
  try {
    const usuarios = await User.find({}, "usuario email levelAuth"); // Busca usuário, email e levelAuth
    res.json(usuarios);
    console.log(usuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
});

module.exports = router;
