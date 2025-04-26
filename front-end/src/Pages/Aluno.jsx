import React, { useState, useEffect, useRef } from "react";
import Search from "../Components/Search";
import Filter from "../Components/Filter";
import "./Aluno.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Aluno = () => {
  const [alunos, setAlunos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const tableContainerRef = useRef(null);

  const fetchAlunos = async () => {
    try {
      const response = await axios.get("https://sistemaautoescola.onrender.com/api/alunos");
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    }
  };

  useEffect(() => {
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
  const handleEditarAluno = (codehash) => navigate(`/Editar-aluno/${codehash}`);

  // Função para rolar horizontalmente
  const scrollLeft = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollLeft -= 400;
    }
  };

  const scrollRight = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollLeft += 400;
    }
  };

  return (
    <div className="cadastro-aluno">
      <h1>Alunos</h1>
      <div className="header">
        <div className="position-search-filter">
           <Search
          placeholder="Pesquisar aluno"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search"
        />
      <Filter/> 
        </div>
       
        <button onClick={handleCadastrarAluno} className="cadastrar-btn">
          Cadastrar Aluno
        </button>
        
      </div>
      
      <br />
      <div className="table-wrapper">
       

        <div className="table-container" ref={tableContainerRef}>
          <table>
            <thead>
              <tr>
                <th>Matricula</th>
                <th>Nome</th>
                <th>Nascimento</th>
                <th>CPF</th>
                <th>Instrutor</th>
                <th>TC</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlunos.map((aluno) => (
                <tr key={aluno.codehash}>
                  <td>{aluno.codehash}</td>
                  <td>{aluno.nome}</td>
                  <td>{new Date(aluno.dataNascimento).toLocaleDateString("pt-BR")}</td>
                  <td>{aluno.cpf}</td>
                  <td>{aluno.instrutorNome}</td>
                  <td>{aluno.tipoCarteira}</td>
                  <td className="edit">
                    <button className="btn-edit" onClick={() => handleEditarAluno(aluno.codehash)}>
                      Consultar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button className="scroll-btn left-btn" onClick={scrollLeft}>{"<"}</button>
        <button className="scroll-btn right-btn" onClick={scrollRight}>{">"}</button>
        </div>
        
      </div>
    </div>
  );
};

export default Aluno;
