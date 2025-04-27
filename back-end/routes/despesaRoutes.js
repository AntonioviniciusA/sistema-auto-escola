const express = require("express");
const router = express.Router();
const Despesa = require("../models/despesaModels");
const authenticateToken = require("../middleware/authJWT");


// Create a new despesa record
router.post("/", async (req, res) => {
  try {
    const despesa = new Despesa(req.body);
    await despesa.save();

    // Count the number of records for each field
    const count = {
      abastecimento: await Despesa.countDocuments({
        abastecimento: { $exists: true },
      }),
      manutencao: await Despesa.countDocuments({
        manutencao: { $exists: true },
      }),
      revisao: await Despesa.countDocuments({ revisao: { $exists: true } }),
    };

    res.status(201).send({ despesa, count });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update a specific despesa record by ID
router.put("/:id",authenticateToken, async (req, res) => {
  try {
    const despesa = await Despesa.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!despesa) {
      return res.status(404).send();
    }

    // Count the number of records for each field
    const count = {
      abastecimento: await Despesa.countDocuments({
        abastecimento: { $exists: true },
      }),
      manutencao: await Despesa.countDocuments({
        manutencao: { $exists: true },
      }),
      revisao: await Despesa.countDocuments({ revisao: { $exists: true } }),
    };

    res.status(200).send({ despesa, count });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all despesas
router.get("/", authenticateToken, async (req, res) => {
  try {
    const despesas = await Despesa.find({});

    // Sum the values of abastecimento, manutenção and revisão
    const totalValues = despesas.reduce(
      (acc, despesa) => {
        acc.abastecimento += despesa.abastecimento;
        acc.manutencao += despesa.manutencao;
        acc.revisao += despesa.revisao;
        return acc;
      },
      { abastecimento: 0, manutencao: 0, revisao: 0 }
    );

    res.status(200).send({ despesas, totalValues });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/graficos", authenticateToken, async (req, res) => {
  try {
    const despesas = await Despesa.find({}).sort({ data: 1 });

    const monthlyData = {};
    const dailyData = [];

    despesas.forEach((despesa) => {
      const date = new Date(despesa.data);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      const dayMonthYear = date.toISOString().split("T")[0];

      // Inicializa o mês se não existir
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          abastecimento: 0,
          manutencao: 0,
          revisao: 0,
          label: `Mês ${monthYear}`,
        };
      }

      // Processa cada tipo de despesa separadamente
      if (despesa.abastecimento) {
        const valor = Number(despesa.abastecimento) || 0;
        monthlyData[monthYear].abastecimento += valor;
        dailyData.push({
          date: dayMonthYear,
          valor: valor,
          tipo: "abastecimento",
          fullDate: despesa.data,
        });
      }

      if (despesa.manutencao) {
        const valor = Number(despesa.manutencao) || 0;
        monthlyData[monthYear].manutencao += valor;
        dailyData.push({
          date: dayMonthYear,
          valor: valor,
          tipo: "manutencao",
          fullDate: despesa.data,
        });
      }

      if (despesa.revisao) {
        const valor = Number(despesa.revisao) || 0;
        monthlyData[monthYear].revisao += valor;
        dailyData.push({
          date: dayMonthYear,
          valor: valor,
          tipo: "revisao",
          fullDate: despesa.data,
        });
      }
    });

    // console.log("Dados mensais processados:", monthlyData);

    // Ordenação por data
    dailyData.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

    res.status(200).send({
      mensal: Object.values(monthlyData),
      diario: dailyData.map((item) => ({
        ...item,
        date: new Date(item.fullDate).toLocaleDateString("pt-BR"),
        valor: Number(item.valor),
      })),
    });
  } catch (error) {
    console.error("Erro ao buscar dados para gráficos:", error);
    res.status(500).send({
      error: "Erro ao processar dados",
      details: error.message,
    });
  }
});
// Route to delete a despesa by ID
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deletedDespesa = await Despesa.findByIdAndDelete(req.params.id);

    if (!deletedDespesa) {
      return res.status(404).json({ message: "Despesa não encontrada" });
    }

    res.status(200).json({ message: "Despesa apagada com sucesso!" });
  } catch (error) {
    console.error("Erro ao apagar despesa:", error);
    res.status(500).json({ message: "Erro ao apagar despesa" });
  }
});

module.exports = router;
