const mongoose = require("mongoose");

const AulaSchema = new mongoose.Schema({
  instrutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    required: [true, "Instrutor é obrigatório"],
  },
  aluno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Aluno",
    required: [true, "Aluno é obrigatório"],
  },
  veiculo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Veiculo",
    required: [true, "Veículo é obrigatório"],
  },
  data: {
    type: Date,
    required: [true, "Data é obrigatória"],
    validate: {
      validator: function (v) {
        return v instanceof Date && !isNaN(v);
      },
      message: "Data inválida!",
    },
  },
  tipo: {
    type: String,
    enum: ["simples", "dupla"],
    required: [true, "Tipo de aula é obrigatório"],
  },
  status: {
    type: String,
    default: "agendada",
  },
});
// Campo virtual para duração da aula
AulaSchema.virtual("duracao").get(function () {
  return this.tipo === "dupla" ? 100 : 50;
});

// Middleware para verificar se a data é válida
AulaSchema.pre("save", function (next) {
  if (isNaN(this.data.getTime())) {
    return next(new Error("Data inválida"));
  }
  next();
});

module.exports = mongoose.model("Aula", AulaSchema);
