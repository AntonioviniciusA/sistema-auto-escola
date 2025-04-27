const express = require("express");
const router = express.Router();
const Aluno = require("../models/AlunosModels");
const Aula = require("../models/aulaModels");
const mongoose = require("mongoose");

// Rota para verificar a performance dos alunos
router.get("/checkPerformance", async (req, res) => {
  try {
    const alunos = await Aluno.find().lean(); // Busca todos os alunos
    const aulas = await Aula.find({ status: "Concluída" }).lean(); // Busca apenas aulas concluídas

    const performanceData = alunos.map((aluno) => {
      const aulasDoAluno = aulas.filter(
        (aula) => String(aula.aluno) === String(aluno._id)
      );
      const completedClassesCount = aulasDoAluno.reduce(
        (total, aula) => total + (aula.tipo === "dupla" ? 2 : 1),
        0
      );

      return {
        alunoId: aluno._id,
        alunoNome: aluno.nome,
        completedClasses: completedClassesCount,
        message:
          completedClassesCount >= 20
            ? "O aluno completou 20 aulas ou mais."
            : "O aluno não completou 20 aulas ainda.",
      };
    });

    return res.status(200).json(performanceData);
  } catch (error) {
    console.error("Erro ao verificar a performance dos alunos:", error);
    return res
      .status(500)
      .json({ error: "Erro ao verificar a performance dos alunos" });
  }
});

// Rota para verificar o armazenamento do banco de dados
router.get("/checkStorage", async (req, res) => {
  try {
    const stats = await mongoose.connection.db.stats(); // Obtém estatísticas do banco de dados
    const storageUsedMB = (stats.dataSize / (1024 * 1024)).toFixed(2); // Convertido para MB
    const storageLimitMB = 300; // Limite de 300 MB

    return res.status(200).json({
      message:
        storageUsedMB >= storageLimitMB
          ? "Alerta: O espaço do banco de dados está cheio!"
          : "O espaço do banco de dados está dentro dos limites.",
      storageUsedMB,
      storageLimitMB,
    });
  } catch (error) {
    console.error("Erro ao verificar o espaço do banco de dados:", error);
    return res
      .status(500)
      .json({ error: "Erro ao verificar o espaço do banco de dados" });
  }
});

module.exports = router;
