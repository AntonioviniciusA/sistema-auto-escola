const mongoose = require("mongoose");

const veiculoSchema = new mongoose.Schema({
  modelo: {
    type: String,
    required: true,
  },
  marca: {
    type: String,
    required: true,
  },
  ano: {
    type: String,
    required: true,
  },
  placa: {
    type: String,
    required: true,
    unique: true,
  },
  tipo: {
    type: String,
    required: true,
  },
  fuelLevel: {
    type: Number,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Veiculo", veiculoSchema);
