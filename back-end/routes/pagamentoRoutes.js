const express = require("express");
const router = express.Router();
const Pagamento = require("../models/pagamentoModels");
const authenticateToken = require("../middleware/authJWT");


// Criar um novo registro de pagamento
router.post("/", async (req, res) => {
  try {
    const pagamento = new Pagamento({
      ...req.body,
      dataPagamento: null, // Define a data do pagamento como nula inicialmente
      // Garante que a dataPagamento não seja obrigatória para novos pagamentos
    });
    await pagamento.save();
    res.status(201).send(pagamento);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Recuperar todos os registros de pagamento e popular o campo alunos
router.get("/", authenticateToken, async (req, res) => {
  try {
    const pagamentos = await Pagamento.find().populate("aluno"); // Popula os dados dos alunos

    const pagamentosAluno = pagamentos.map((pagamento) => ({
      id: pagamento._id,
      valor: pagamento.valor,
      dataVencimento: pagamento.dataVencimento,
      dataPagamento: pagamento.dataPagamento,
      status: pagamento.status,
      alunoId: pagamento.aluno.id,
      AlunoNome:
        pagamento.aluno && pagamento.aluno.nome
          ? pagamento.aluno.nome
          : "Desconhecido", // Verifica se o aluno existe
    }));
    // console.log(pagamentosAluno);
    res.status(200).send(pagamentosAluno);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Recuperar um registro de pagamento específico por ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const pagamento = await Pagamento.findById(req.params.id);
    if (!pagamento) {
      return res.status(404).send();
    }
    res.status(200).send(pagamento);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Atualizar um registro de pagamento específico por ID
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const pagamento = await Pagamento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pagamento) {
      return res.status(404).send();
    }
    res.status(200).send(pagamento);
  } catch (error) {
    res.status(400).send(error);
  }
});
// Atualizar um registro de pagamento específico por ID
router.put("/pago/:id", authenticateToken, async (req, res) => {
  try {
    // 1. Validação dos dados de entrada
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "status",
      "tipoPagamento",
      "dataPagamento",
      "valor",
      "dataVencimento",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({
        error: "Campos inválidos para atualização!",
        camposPermitidos: allowedUpdates,
      });
    }

    // 2. Validação específica para status
    if (
      req.body.status &&
      !["pendente", "pago", "vencido"].includes(req.body.status)
    ) {
      return res.status(400).send({
        error: "Status inválido!",
        valoresPermitidos: ["pendente", "pago", "vencido"],
      });
    }

    // 3. Validação específica para tipoPagamento
    if (
      req.body.tipoPagamento &&
      !["Cartão de Crédito", "Pix", "Boleto", "Dinheiro"].includes(
        req.body.tipoPagamento
      )
    ) {
      return res.status(400).send({
        error: "Tipo de pagamento inválido!",
        valoresPermitidos: ["Cartão de Crédito", "Pix", "Boleto", "Dinheiro"],
      });
    }

    // 4. Atualização do documento
    const pagamento = await Pagamento.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        context: "query", // Garante que as validações do schema sejam aplicadas
      }
    );

    if (!pagamento) {
      return res.status(404).send({
        error: "Pagamento não encontrado!",
        sugestao: "Verifique se o ID está correto",
      });
    }

    // 5. Resposta formatada
    res.status(200).send({
      message: "Pagamento atualizado com sucesso!",
      data: pagamento,
      links: {
        consultar: `/api/pagamentos/${pagamento._id}`,
        listar: "/api/pagamentos",
      },
    });
  } catch (error) {
    // 6. Tratamento detalhado de erros
    if (error.name === "CastError") {
      return res.status(400).send({
        error: "ID inválido!",
        detalhes: "O formato do ID não corresponde ao esperado",
      });
    }

    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send({
        error: "Erro de validação!",
        detalhes: errors,
      });
    }

    // 7. Erro genérico (não previsto)
    res.status(500).send({
      error: "Falha ao atualizar pagamento!",
      detalhes:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});
// Excluir um registro de pagamento específico por ID
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const pagamento = await Pagamento.findByIdAndDelete(req.params.id);
    if (!pagamento) {
      return res.status(404).send();
    }
    res.status(200).send(pagamento);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/aluno/:studentId", authenticateToken, async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const pagamentos = await Pagamento.find({ aluno: studentId });
    res.status(200).send(pagamentos);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Obter dados para gráficos
router.get("/graficos", authenticateToken, async (req, res) => {
  try {
    const pagamentos = await Pagamento.find({ aluno: req.params.id });

    // Agrupar por status
    const porStatus = pagamentos.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});

    // Agrupar por tipo de pagamento
    const porTipo = pagamentos.reduce((acc, p) => {
      acc[p.tipoPagamento] = (acc[p.tipoPagamento] || 0) + 1;
      return acc;
    }, {});

    // Valores por mês
    const porMes = pagamentos.reduce((acc, p) => {
      const mes = p.dataVencimento.getMonth() + 1;
      acc[mes] = (acc[mes] || 0) + p.valor;
      return acc;
    }, {});

    res.send({
      porStatus,
      porTipo,
      porMes,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
