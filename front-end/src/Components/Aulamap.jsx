import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import "./AulaMap.css";
import { Printer } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { FaChevronRight, FaChevronLeft, FaExclamationTriangle } from "react-icons/fa";

const AulasAluno = () => {
  const { id } = useParams();
  const [aulas, setAulas] = useState([]);
  const [aluno, setAluno] = useState(null);
  const navigate = useNavigate();
  const tableContainerRef = useRef(null);

  // Funções para manipulação do scroll horizontal
  const scrollLeft = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollLeft -= 300;
    }
  };

  const scrollRight = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollLeft += 300;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseAulas = await axios.get(
          `https://sistemaautoescola.onrender.com/api/aula/aluno/${id}`
        );
        setAulas(responseAulas.data);

        const responseAluno = await axios.get(
          `https://sistemaautoescola.onrender.com/api/alunos/${id}`
        );
        setAluno(responseAluno.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [id]);

  const handlePrint = () => {
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <style>
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0px;
          }
          .no-print {
            display: none !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #000;
            width: 10%;
            padding: 0px;
            text-align: center;
          }
          th {
            background-color: #f2f2f2;
          }
          .header-print {
            text-align: center;
            margin-bottom: 20px;
          }
          .header-print h2 {
            color: #000 !important;
            margin-bottom: 5px;
          }
          .header-print p {
            color: #000;
            margin-top: 0;
          }
          .aluno-info {
            text-align: left;
            margin-bottom: 15px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          }
          .aluno-info p {
            margin: 5px 0;
          }
        }
      </style>
      <div class="print-container">
        <div class="header-print">
          <h2>Relatório de Aulas do Aluno</h2>
          <div class="aluno-info">
            <p><strong>Aluno:</strong> ${aluno?.nome  || 'Não informado'}</p>
            <p><strong>Data de Nascimento:</strong> ${aluno?.dataNascimento ? new Date(aluno.dataNascimento).toLocaleDateString("pt-BR") : 'Não informado'}</p>
            <p><strong>Cpf:</strong> ${aluno?.cpf || 'Não informado'}</p>
            <p><strong>Contato:</strong> ${aluno?.telefone || 'Não informado'}</p>
          </div>
          <p>Total de aulas: ${aulas.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Horário</th>
              <th>Instrutor</th>
              <th>Veículo</th>
              <th>Placa</th>
            </tr>
          </thead>
          <tbody>
            ${aulas.map(aula => `
              <tr>
                <td>${new Date(aula.data).toLocaleDateString("pt-BR")}</td>
                <td>${new Date(aula.data).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}</td>
                <td>${aula.instrutor?.usuario || "Sem instrutor"}</td>
                <td>${aula.veiculo ? `${aula.veiculo.modelo} - ${aula.veiculo.marca}` : "Sem veículo"}</td>
                <td>${aula.veiculo?.placa || "Sem placa"}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    document.body.appendChild(printContent);
    window.print();
    document.body.removeChild(printContent);
  };

  return (
    <div className="container-bg-aula">
      <div className="header-btn-print no-print">
        <button onClick={handlePrint} className="btn-print">
          <Printer size={18} />
          Imprimir Aulas
        </button>

        <button onClick={handlePrint} className="btn-warning-print">
          <FaExclamationTriangle size={18} className="piscar" />
          Não é possivel imprimir no momento
        </button>
      </div>

      {aulas.length > 0 ? (
        <div>
          <TableContainer ref={tableContainerRef}>
            <Table className="tabela-aulas">
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Horário</TableCell>
                  <TableCell>Instrutor</TableCell>
                  <TableCell>Veículo</TableCell>
                  <TableCell>Placa</TableCell>
                  <TableCell className="no-print">Detalhes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {aulas.map((aula) => (
                  <TableRow key={aula._id}>
                    <TableCell>
                      {new Date(aula.data).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      {new Date(aula.data).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      {aula.instrutor?.usuario || "Sem instrutor"}
                    </TableCell>
                    <TableCell>
                      {aula.veiculo
                        ? `${aula.veiculo.modelo} - ${aula.veiculo.marca}`
                        : "Sem veículo"}
                    </TableCell>
                    <TableCell>{aula.veiculo?.placa || "Sem placa"}</TableCell>
                    <TableCell className="no-print">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(`/detalhes/${aula._id}`)}
                        startIcon={<FaPencilAlt />}
                        fullWidth
                        sx={{
                          border: "1px solid var(--details) !important",
                        }}
                      >
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <div className="pagination-no-print">
            <button className="scroll-btn left-btn" onClick={scrollLeft}>
              <FaChevronLeft size={18} />
            </button>
            <button className="scroll-btn right-btn" onClick={scrollRight}>
              <FaChevronRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        <p>Este aluno ainda não possui aulas cadastradas.</p>
      )}
    </div>
  );
};

export default AulasAluno;