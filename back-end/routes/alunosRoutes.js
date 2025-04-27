// routes/alunoRoutes.js
const mongoose = require("mongoose");
const express = require("express");
const Aluno = require("../models/AlunosModels.js");
const Instrutor = require("../models/instrutoresModels");
const Aula = require("../models/aulaModels.js");
const Pagamento = require("../models/pagamentoModels");
const authenticateToken = require("../middleware/authJWT");
const router = express.Router();

// Criar aluno
router.post("/", authenticateToken, async (req, res) => {
  try {
    const aluno = new Aluno(req.body);
    await aluno.save();
    res.status(201).json(aluno); // Mantenha apenas esta resposta
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", authenticateToken, async (req, res) => {
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

// Rota para obter um aluno pelo id
router.get("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    // Verifica se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Busca o aluno
    const aluno = await Aluno.findById(_id);
    // console.log(aluno);
    // Se o aluno não for encontrado, retorna erro
    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    // Busca o instrutor associado ao aluno
    const instrutor = await Instrutor.findById(aluno.instrutor);

    // Retorna o aluno com o nome do instrutor
    return res.json({
      ...aluno.toObject(),
      instrutorNome: instrutor ? instrutor.usuario : "Desconhecido", // Verifica se o instrutor existe
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar aluno", error });
  }
});

router.put("/:id", async (req, res) => {
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
// deleta o aluno
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Deleta o aluno pelo id
    const alunoDeletado = await Aluno.findByIdAndDelete(id);
    if (!alunoDeletado) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    // Deleta todas as aulas associadas ao aluno
    await Aula.deleteMany({ aluno: id });

    // Deleta todos os pagamentos associados ao aluno
    await Pagamento.deleteMany({ aluno: id });

    res.json({ message: "Aluno e relacionados deletados com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar aluno", error });
  }
});

module.exports = router;
