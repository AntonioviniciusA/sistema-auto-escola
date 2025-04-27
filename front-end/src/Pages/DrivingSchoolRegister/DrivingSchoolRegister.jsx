import React, { useState, useEffect } from "react";
import axios from "axios";
import FullScreen from "../../Components/FullScreenButton/FullScreenButton.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from "@mui/material";
import "./DrivingSchoolRegister.css";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Load_pages from "../../Components/Load_pages";

const DrivingSchoolRegister = () => {
  const [vehicle, setVehicle] = useState({
    modelo: "",
    marca: "",
    ano: "",
    placa: "",
    tipo: "",
    fuelLevel: "",
    mileage: "",
  });
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(
          "https://sistemaautoescola.onrender.com/api/veiculos"
        );
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
        }, 300);
      }
    };
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `https://sistemaautoescola.onrender.com/api/veiculos/${editingVehicleId}`,
          vehicle
        );
        alert("Vehicle updated successfully!");
      } else {
        await axios.post(
          "https://sistemaautoescola.onrender.com/api/veiculos",
          vehicle
        );
        alert("Vehicle registered successfully!");
      }
    } catch (error) {
      console.error("Error saving vehicle:", error);
      alert("Failed to save vehicle. Please try again.");
    }

    setVehicle({
      modelo: "",
      marca: "",
      ano: "",
      placa: "",
      tipo: "",
      fuelLevel: "",
      mileage: "",
    });
    setIsEditing(false);
    setEditingVehicleId(null);

    const response = await axios.get(
      "https://sistemaautoescola.onrender.com/api/veiculos"
    );
    setVehicles(response.data);
  };

  const handleEdit = (vehicleId) => {
    const vehicleToEdit = vehicles.find((v) => v._id === vehicleId);
    setVehicle(vehicleToEdit);
    setIsEditing(true);
    setEditingVehicleId(vehicleId);
  };

  const handleDelete = async (vehicleId) => {
    try {
      await axios.delete(
        `https://sistemaautoescola.onrender.com/api/veiculos/${vehicleId}`
      );
      alert("Vehicle deleted successfully!");
      setVehicles(vehicles.filter((v) => v._id !== vehicleId));
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Failed to delete vehicle. Please try again.");
    }
  };

  if (isRefreshing) {
    return <Load_pages />;
  }

  return (
    <div className="container-Dr">
      <FullScreen />
      <h1>{isEditing ? "Edit Vehicle" : "Registrar Veiculo"}</h1>
      <form onSubmit={handleSubmit} className="form-container">
        {Object.keys(vehicle).map((key) => (
          <input
            key={key}
            type={
              key === "ano" || key === "fuelLevel" || key === "mileage"
                ? "number"
                : "text"
            }
            name={key}
            value={vehicle[key]}
            onChange={handleChange}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            required
            className="ManageExpenses"
          />
        ))}
        <button type="submit" className="submit-button">
          {isEditing ? "Atualizar Veículo" : "Registrar Veiculo"}
        </button>
      </form>
      <h2>Veiculos Registrados</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Modelo</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Ano</TableCell>
              <TableCell>Editar</TableCell>
              <TableCell>Deletar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((v) => (
              <TableRow key={v._id}>
                <TableCell>{v.modelo}</TableCell>
                <TableCell>{v.marca}</TableCell>
                <TableCell>{v.ano}</TableCell>
                <TableCell sx={{ width: "100px" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(v._id)}
                    startIcon={<FaPencilAlt />}
                    sx={{
                      width: "100%",
                      border: "1px solid var(--details) !important",
                    }}
                  >
                    Editar
                  </Button>
                </TableCell>
                <TableCell sx={{ width: "100px" }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(v._id)}
                    sx={{ width: "100%" }}
                  >
                    Deletar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DrivingSchoolRegister;
