const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Aluno = require("../models/AlunosModels");
const Instrutor = require("../models/instrutoresModels");
const Aula = require("../models/aulaModels"); //Ensure Aula model is imported
const Veiculo = require("../models/veiculoModels");
const authMiddleware = require("../middleware/authJWT.js");


// Rota para criar uma nova aula
router.post("/", authMiddleware,  async (req, res) => {
  const { instructor, datetime, duration, student, veiculo } = req.body;

  try {
    // Criando a data completa com o horário
    const dataHora = new Date(datetime);

    // Criação da nova aula
    const newAula = new Aula({
      data: dataHora, // Agora já inclui data e hora juntas
      tipo: duration === "100" ? "dupla" : "simples",
      instrutor: instructor,
      aluno: student,
      status: "Marcada",
      veiculo: veiculo,
    });

    await newAula.save();
    return res.status(201).json(newAula);
  } catch (error) {
    console.error("Erro ao criar a aula:", error);
    return res.status(500).json({ error: "Erro ao criar a aula" });
  }
});

// Listar aulas
// Rota para listar as aulas com instrutores e aluno detalhado
router.get("/", authMiddleware, async (req, res) => {
  const aulas = await Aula.find();
  try {
    // Busca do instrutor e aluno separadamente
    const aulasComInstrutorAluno = await Promise.all(
      aulas.map(async (aula) => {
        const instrutor = await Instrutor.findById(aula.instrutor);
        const alunobd = await Aluno.findById(aula.aluno); // Ajustado para um único aluno
        const veiculo = await Veiculo.findById(aula.veiculo);
        return {
          ...aula.toObject(),
          instrutorNome: instrutor ? instrutor.usuario : "Desconhecido", // Verifique se instrutor existe
          alunoNome: alunobd ? alunobd.nome : "Desconhecido", // Verifique se aluno existe
          veiculoPlaca: veiculo ? veiculo.placa : "Desconhecido", // Verifique
          veiculoModelo: veiculo ? veiculo.modelo : "Desconhecido", // Verifique
          veiculoMarca: veiculo ? veiculo.marca : "Desconhecido", // Verifique
        };
      })
    );

    return res.status(200).json(aulasComInstrutorAluno);
  } catch (error) {
    console.error("Erro ao listar as aulas:", error);

    return res.status(500).json({ error: "Erro ao listar as aulas" });
  }
});

router.get("/:_id", authMiddleware, async (req, res) => {
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

router.put("/attclass/:_id", authMiddleware, async (req, res) => {
  try {
    const { _id } = req.params;
    const { data, tipo, instrutor, aluno, status } = req.body;

    const aulaAtualizada = await Aula.findByIdAndUpdate(
      _id,
      {
        data,
        tipo,
        instrutor,
        aluno,
        status,
      },
      { new: true }
    );

    if (!aulaAtualizada) {
      return res.status(404).json({ message: "Aula não encontrada" });
    }

    res.json(aulaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar aula:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
});
// Rota para atualizar o status da aula
router.put("/status/:_id", authMiddleware, async (req, res) => {
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

// Rota para buscar aulas pelo ID do aluno
router.get("/aluno/:_id", authMiddleware, async (req, res) => {
  try {
    const { _id } = req.params;

    const aulas = await Aula.find({ aluno: _id }) // Busca todas as aulas do aluno
      .populate("instrutor") // Popula os dados do instrutor
      .populate("aluno") // Popula os dados do aluno
      .populate("veiculo"); // Popula os dados do veiculo

    if (!aulas || aulas.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhuma aula encontrada para este aluno" });
    }

    res.json(aulas);
  } catch (error) {
    console.error("Erro ao buscar aulas do aluno:", error);
    res.status(500).json({ message: "Erro ao buscar aulas do aluno", error });
  }
});

// Rota para buscar aulas pelo ID do instrutor
router.get("/instrutor/:_id", authMiddleware, async (req, res) => {
  try {
    const { _id } = req.params;

    const aulas = await Aula.find({ instrutor: _id }) // Busca todas as aulas do aluno
      .populate("instrutor") // Popula os dados do instrutor
      .populate("aluno"); // Popula os dados do aluno

    if (!aulas || aulas.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhuma aula encontrada para este instrutor" });
    }
    console.log(aulas);
    res.json(aulas);
  } catch (error) {
    console.error("Erro ao buscar aulas do instrutor:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar aulas do instrutor", error });
  }
});

// Rota para deletar uma aula
router.delete("/:_id", authMiddleware, async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedAula = await Aula.findByIdAndDelete(_id);

    if (!deletedAula) {
      return res.status(404).json({ message: "Aula não encontrada" });
    }

    res.status(200).json({ message: "Aula apagada com sucesso!" });
  } catch (error) {
    console.error("Erro ao apagar aula:", error);
    res.status(500).json({ message: "Erro ao apagar aula" });
  }
});

router.post("/multiple", authMiddleware, async (req, res) => {
  try {
    const aulas = req.body;

    // Validação reforçada
    if (!Array.isArray(aulas)) {
      return res.status(400).json({
        success: false,
        message: "Payload deve ser um array de aulas",
        receivedType: typeof aulas,
      });
    }

    const results = await Promise.allSettled(
      aulas.map(async (aulaData, index) => {
        try {
          // Validação de campos
          const requiredFields = [
            "instructor",
            "student",
            "veiculo",
            "datetime",
            "tipo",
          ];
          const missingFields = requiredFields.filter(
            (field) => !aulaData[field]
          );

          if (missingFields.length > 0) {
            throw new Error(`Campos faltando: ${missingFields.join(", ")}`);
          }

          // Converter data
          const data = new Date(aulaData.datetime);
          if (isNaN(data.getTime())) {
            throw new Error(`Data inválida: ${aulaData.datetime}`);
          }

          // Verificar conflitos
          const duration = aulaData.tipo === "dupla" ? 100 : 50;
          const endDate = new Date(data.getTime() + duration * 60000);

          const conflitos = await Aula.find({
            $or: [
              {
                instrutor: aulaData.instructor,
                data: { $lt: endDate, $gte: data },
              },
              {
                veiculo: aulaData.veiculo,
                data: { $lt: endDate, $gte: data },
              },
            ],
          });

          if (conflitos.length > 0) {
            throw new Error(
              `Conflito de horário com: ${conflitos.map((c) => c._id)}`
            );
          }

          // Criar e salvar aula
          const novaAula = new Aula({
            instrutor: aulaData.instructor,
            aluno: aulaData.student,
            veiculo: aulaData.veiculo,
            data: data,
            tipo: aulaData.tipo,
            status: "agendada",
          });

          const savedAula = await novaAula.save();
          return { success: true, data: savedAula };
        } catch (error) {
          return {
            success: false,
            index,
            error: error.message,
            receivedData: aulaData,
          };
        }
      })
    );

    // Processar resultados
    const savedAulas = results
      .filter((r) => r.value?.success)
      .map((r) => r.value.data);
    const errors = results.filter((r) => !r.value?.success).map((r) => r.value);

    return res.status(200).json({
      success: true,
      message: `Processado ${aulas.length} aulas`,
      saved: savedAulas,
      errors: errors,
    });
  } catch (error) {
    console.error("Erro global:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});
module.exports = router;
