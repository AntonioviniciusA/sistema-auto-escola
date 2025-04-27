const mongoose = require("mongoose");

const PagamentoSchema = new mongoose.Schema({
  dataVencimento: {
    type: String, // Alterado para String
    required: true,
  },
  dataPagamento: {
    type: String, // Alterado para String
  },
  tipoPagamento: {
    type: String,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  parcela: {
    type: Number,
    required: true,
  },
  aluno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Aluno",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pendente", "Pago", "Vencido"],
    default: "Pendente",
  },
});

// Função para formatar a data
const formatDate = (date) => {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Intl.DateTimeFormat("pt-BR", options).format(new Date(date));
};

// Hook para formatar as datas antes de salvar
PagamentoSchema.pre("save", function (next) {
  if (this.dataVencimento) {
    // Formatando a dataVencimento
    this.dataVencimento = formatDate(this.dataVencimento);
  }

  if (this.dataPagamento) {
    // Formatando a dataPagamento
    this.dataPagamento = formatDate(this.dataPagamento);
  }

  next();
});

const Pagamento = mongoose.model("Pagamento", PagamentoSchema);
module.exports = Pagamento;
