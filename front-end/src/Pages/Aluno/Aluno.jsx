import React, { useState, useEffect, useRef } from "react";
import Search from "../../Components/Search";
import "./Aluno.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Load_pages from "../../Components/Load_pages";
import FullScreen from "../../Components/FullScreenButton/FullScreenButton.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  FaChevronRight,
  FaChevronLeft,
  FaExclamationTriangle,
} from "react-icons/fa";

const Aluno = () => {
  const [alunos, setAlunos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const tableContainerRef = useRef(null);
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await axios.get(
          "https://sistemaautoescola.onrender.com/api/alunos",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAlunos(response.data);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
        }, 300);
      }
    };

    fetchAlunos();
  }, []);

  const filteredAlunos = alunos.filter((aluno) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      aluno.nome.toLowerCase().includes(lowerSearch) ||
      aluno.instrutorNome.toLowerCase().includes(lowerSearch)
    );
  });

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleCadastrarAluno = () => navigate("/Cadastrar-aluno");
  const handleEditarAluno = (_id) => navigate(`/Editar-aluno/${_id}`);

  const scrollLeft = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollLeft -= 50;
    }
  };

  const scrollRight = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollLeft += 100;
    }
  };

  if (isRefreshing) {
    return <Load_pages />;
  }

  return (
    <div className="cadastro-aluno">
      <FullScreen />
      <h1>Alunos</h1>
      <div className="header">
        <div className="position-search-filter">
          <Search
            placeholder="Pesquisar aluno"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search"
          />
          <button onClick={handleCadastrarAluno} className="cadastrar-btn">
            Cadastrar Aluno
          </button>
        </div>
      </div>

      {filteredAlunos.length === 0 ? (
        <div className="ctn-aluno">
          <div className="no-aluno">
            <FaExclamationTriangle size={20} className="piscar" />
            <p>Não há alunos cadastrados.</p>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <div className="table-container">
            <TableContainer ref={tableContainerRef}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Matricula</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Nascimento</TableCell>
                    <TableCell>CPF</TableCell>
                    <TableCell>Instrutor</TableCell>
                    <TableCell>TC</TableCell>
                    <TableCell>Ação</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAlunos.map((aluno) => (
                    <TableRow key={aluno._id}>
                      <TableCell>{aluno.codehash}</TableCell>
                      <TableCell>{aluno.nome}</TableCell>
                      <TableCell>
                        {new Date(aluno.dataNascimento).toLocaleDateString(
                          "pt-BR"
                        )}
                      </TableCell>
                      <TableCell>{aluno.cpf}</TableCell>
                      <TableCell>{aluno.instrutorNome}</TableCell>
                      <TableCell>{aluno.tipoCarteira}</TableCell>
                      <TableCell className="edit">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditarAluno(aluno._id)}
                        >
                          <svg className="search-icon" viewBox="0 0 512 512">
                            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                          </svg>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="pagination">
              <button className="scroll-btn left-btn" onClick={scrollLeft}>
                <FaChevronLeft size={18} />
              </button>
              <button className="scroll-btn right-btn" onClick={scrollRight}>
                <FaChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Aluno;
