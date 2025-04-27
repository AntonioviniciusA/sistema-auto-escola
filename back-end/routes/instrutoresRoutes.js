const express = require("express");
const Instructor = require("../models/instrutoresModels.js");
require("dotenv").config();

const router = express.Router();

router.get("/getall", async (req, res) => {
  try {
    const instrutor = await Instructor.find(); // Busca usuário, email e levelAuth
    res.json(instrutor);
    // console.log(instrutor);
  } catch (error) {
    console.error("Erro ao buscar instrutores:", error);
    res.status(500).json({ message: "Erro ao buscar instrutores" });
  }
});

module.exports = router;
