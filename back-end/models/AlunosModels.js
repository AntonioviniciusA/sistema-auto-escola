const mongoose = require("mongoose");

const AlunoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  codehash: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  telefone: { type: String, required: true },
  dataNascimento: { type: Date, required: true },
  cpf: { type: String, required: true, unique: true },
  rg: { type: String, required: true, unique: true },
  endereco: { type: String, required: true },
  instrutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instrutor",
  },
  tipoCarteira: { type: String, required: true },
});

const Aluno = mongoose.model("Aluno", AlunoSchema);
module.exports = Aluno;
