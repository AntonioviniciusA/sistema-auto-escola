const mongoose = require("mongoose");

const despesaSchema = new mongoose.Schema(
  {
    abastecimento: {
      type: Number,

      required: true,
    },
    manutencao: {
      type: Number,

      required: true,
    },
    revisao: {
      type: Number,

      required: true,
    },
    data: { type: Date, default: Date.now }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Despesa", despesaSchema);
