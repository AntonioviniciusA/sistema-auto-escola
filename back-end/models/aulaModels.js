const mongoose = require("mongoose");

const AulaSchema = new mongoose.Schema({
  data: { type: Date, required: true },
  tipo: { type: String, enum: ["simples", "dupla"], required: true }, // Define o tipo
  instrutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
  },
  aluno: { type: mongoose.Schema.Types.ObjectId, ref: "Aluno" },
  status: { type: String, required: true },
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
