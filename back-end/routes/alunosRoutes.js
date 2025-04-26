// routes/alunoRoutes.js
const express = require("express");
const Aluno = require("../models/AlunosModels.js");
const Instrutor = require("../models/instrutoresModels");
const router = express.Router();

// Criar aluno
router.post("/", async (req, res) => {
  try {
    const aluno = new Aluno(req.body);
    await aluno.save();
    res.status(201).json(aluno); // Mantenha apenas esta resposta
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const alunos = await Aluno.find();
  try {
    const alunosComInstrutor = await Promise.all(
      alunos.map(async (aluno) => {
        const instrutor = await Instrutor.findById(aluno.instrutor);

        return {
          ...aluno.toObject(),
          instrutorNome: instrutor ? instrutor.usuario : "Desconhecido", // Verifique se instrutor existe
        };
      })
    );
    return res.status(200).json(alunosComInstrutor);
  } catch (error) {
    console.error("Erro ao buscar instrutores:", error);
    res.status(500).json({ message: "Erro ao buscar instrutores" });
  }
});
// Rota para obter um aluno pelo codehash
router.get("/api/alunos/:codehash", async (req, res) => {
  try {
    const { codehash } = req.params;
    const aluno = await Aluno.findOne({ codehash });
    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar aluno", error });
  }
});
router.put("/api/alunos/:id", async (req, res) => {
  // atualiza o aluno editado
  try {
    const { id } = req.params;
    // busca pelo id  o aluno
    const alunoAtualizado = await Aluno.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!alunoAtualizado) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    res.json({
      message: "Aluno atualizado com sucesso!",
      aluno: alunoAtualizado,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar aluno", error });
  }
});

module.exports = router;
