import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DrivingSchoolExpenses.css";
import Load_pages from "../../Components/Load_pages";
import FullScreen from "../../Components/FullScreenButton/FullScreenButton.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

const ManageExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [newExpense, setNewExpense] = useState({
    abastecimento: "",
    manutencao: "",
    revisao: "",
  });
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        "https://sistemaautoescola.onrender.com/api/despesas/"
      );
      setExpenses(response.data.despesas);
      setTotal(response.data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 300);
    }
  };
  if (!expenses) {
    return <p>Carregando...</p>;
  }
  const handleChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "https://sistemaautoescola.onrender.com/api/despesas",
      newExpense
    );
    setExpenses([...expenses, response.data.despesa]); // Corrigido
    setTotal(response.data.total);
    setNewExpense({ abastecimento: "", manutencao: "", revisao: "" });
  };
  const handleDelete = async (id) => {
    const response = await axios.delete(
      `https://sistemaautoescola.onrender.com/api/despesas/${id}`
    );
    setExpenses(expenses.filter((expense) => expense.id !== id));
    setTotal(response.data.total);
    window.location.reload();
  };

  if (isRefreshing) {
    return <Load_pages />;
  }

  return (
    <div className="Container-Manage-Expenses">
      <FullScreen />
      <h1>Gerenciar Despesas</h1>

      <form onSubmit={handleSubmit} className="formManageExpenses">
        <input
          className="ManageExpenses"
          type="number"
          name="abastecimento"
          value={newExpense.abastecimento}
          onChange={handleChange}
          placeholder="Abastecimento"
          required
        />
        <input
          className="ManageExpenses"
          type="number"
          name="manutencao"
          value={newExpense.manutencao}
          onChange={handleChange}
          placeholder="Manutencao"
          required
        />
        <input
          className="ManageExpenses"
          type="number"
          name="revisao"
          value={newExpense.revisao}
          onChange={handleChange}
          placeholder="Revisao"
          required
        />
        <button type="submit">Adicionar Despesa</button>
      </form>
      <h2>Total de Despesas: {total}</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Abastecimento</TableCell>
              <TableCell>Manutenção</TableCell>
              <TableCell>Revisão</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense._id}>
                <TableCell>R${expense.abastecimento}</TableCell>
                <TableCell>R${expense.manutencao}</TableCell>
                <TableCell>R${expense.revisao}</TableCell>
                <TableCell>
                  <Button
                    className="deletbutton"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(expense._id)}
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

export default ManageExpenses;
