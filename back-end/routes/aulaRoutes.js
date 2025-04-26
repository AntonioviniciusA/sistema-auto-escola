const express = require("express");
const router = express.Router();
const Aluno = require("../models/AlunosModels");
const Instrutor = require("../models/instrutoresModels");

// Rota para criar uma nova aula
router.post("/", async (req, res) => {
  const { instructor, datetime, duration, student } = req.body;

  try {
    // Criando a data completa com o horário
    const dataHora = new Date(datetime);

    // Criação da nova aula
    const newAula = new Aula({
      descricao: "",
      data: dataHora, // Agora já inclui data e hora juntas
      tipo: duration === "100" ? "dupla" : "simples",
      instrutor: instructor,
      aluno: student,
      status: "MARCADA",
    });

    await newAula.save();
    return res.status(201).json(newAula);
  } catch (error) {
    console.error("Erro ao criar a aula:", error);
    return res.status(500).json({ error: "Erro ao criar a aula" });
  }
});

// Listar aulas
const Aula = require("../models/aulaModels");

// Rota para listar as aulas com instrutores e aluno detalhado
router.get("/", async (req, res) => {
  const aulas = await Aula.find();
  try {
    // Busca do instrutor e aluno separadamente
    const aulasComInstrutorAluno = await Promise.all(
      aulas.map(async (aula) => {
        const instrutor = await Instrutor.findById(aula.instrutor);
        const alunobd = await Aluno.findById(aula.aluno); // Ajustado para um único aluno

        return {
          ...aula.toObject(),
          instrutorNome: instrutor ? instrutor.usuario : "Desconhecido", // Verifique se instrutor existe
          alunoNome: alunobd ? alunobd.nome : "Desconhecido", // Verifique se aluno existe
        };
      })
    );

    return res.status(200).json(aulasComInstrutorAluno);
  } catch (error) {
    console.error("Erro ao listar as aulas:", error);
    return res.status(500).json({ error: "Erro ao listar as aulas" });
  }
});
router.get("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    const aula = await Aula.findById(_id)
      .populate("instrutor") // Traz os dados do instrutor
      .populate("aluno"); // Traz os dados do aluno

    if (!aula) {
      return res.status(404).json({ message: "Aula não encontrada" });
    }

    res.json(aula);
  } catch (error) {
    console.error("Erro ao buscar detalhes da aula:", error);
    res.status(500).json({ message: "Erro ao buscar detalhes da aula", error });
  }
});

// Rota para atualizar o status da aula
router.put("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const { status } = req.body;

    const aulaAtualizada = await Aula.findByIdAndUpdate(
      _id,
      { status },
      { new: true }
    );

    if (!aulaAtualizada) {
      return res.status(404).json({ message: "Aula não encontrada" });
    }

    res.json(aulaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar status da aula:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

module.exports = router;
