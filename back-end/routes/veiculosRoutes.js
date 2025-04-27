const express = require("express");
const router = express.Router();
const Veiculo = require("../models/veiculoModels");
const Aula = require("../models/aulaModels");
// Create a new vehicle record
router.post("/", async (req, res) => {
  try {
    const veiculo = new Veiculo(req.body);
    await veiculo.save();
    res.status(201).send(veiculo);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Retrieve all vehicle records
router.get("/", async (req, res) => {
  try {
    const veiculos = await Veiculo.find();
    res.status(200).send(veiculos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Retrieve a specific vehicle record by ID
router.get("/:id", async (req, res) => {
  try {
    const veiculo = await Veiculo.findById(req.params.id);
    if (!veiculo) {
      return res.status(404).send();
    }
    res.status(200).send(veiculo);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a specific vehicle record by ID
router.put("/:id", async (req, res) => {
  try {
    const veiculo = await Veiculo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!veiculo) {
      return res.status(404).send();
    }
    res.status(200).send(veiculo);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a specific vehicle record by ID
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const veiculo = await Veiculo.findByIdAndDelete(id);
    if (!veiculo) {
      return res.status(404).send();
    }
    await Aula.deleteMany({ veiculo: id });

    res.status(200).send(veiculo);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
