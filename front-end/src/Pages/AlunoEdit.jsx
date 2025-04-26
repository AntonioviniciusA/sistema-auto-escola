import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./alunoedit.css";
import { FaEdit, FaTrash, FaSave, FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditarAluno = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aluno, setAluno] = useState({
    nome: "",
    telefone: "",
    dataNascimento: "",
    cpf: "",
    endereco: "",
    instrutorNome: "",
    tipoCarteira: "",
  });

  useEffect(() => {
    // Buscar dados do aluno pelo ID
    axios
      .get(`https://sistemaautoescola.onrender.com/api/alunos/${id}`)
      .then((response) => setAluno(response.data))
      .catch((error) => console.error("Erro ao buscar aluno:", error));
  }, [id]);

  const handleChange = (e) => {
    setAluno({ ...aluno, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://sistemaautoescola.onrender.com/api/alunos/${id}`, aluno);
      alert("Aluno atualizado com sucesso!");
      navigate("/alunos");
    } catch (error) {
      toast.error("Erro ao atualizar aluno:", error);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <header>
        <button onClick={() => navigate("/alunos")} className="btn-back">
          <FaArrowLeft className="icon" size={18} />
        </button>
        <h1 id="title">Dados Do Aluno</h1>
      </header>

      <div className="container-consultar">
        <button type="submit" className="btn-size-header">
          <FaEdit className="icon-data" size={20} />
          Editar Dados
        </button>
        <button className="btn-size-header btn-save">
          <FaSave className="icon-data" size={19} />
          Salvar Alterações
        </button>
        <button className="btn-size-header btn-deleted">
          <FaTrash className="icon-data" size={18} />
          Excluir Aluno
        </button>
      </div>

      <div className="container-bg">
        <form onSubmit={handleSubmit} className="container-dados">
          <label className="input-title">Nome:</label>
          <input
            className="input-border"
            id=""
            type="text"
            name="nome"
            value={aluno.nome}
            onChange={handleChange}
            required
          />

          <label className="input-title">Telefone:</label>
          <input
            className="input-border"
            id=""
            type="text"
            name="telefone"
            value={aluno.telefone}
            onChange={handleChange}
            required
          />

          <label className="input-title">Data de Nascimento:</label>
          <input
            className="input-border"
            id=""
            type="date"
            name="dataNascimento"
            value={aluno.dataNascimento}
            onChange={handleChange}
            required
          />

          <label className="input-title">CPF:</label>
          <input
            className="input-border"
            id=""
            type="text"
            name="cpf"
            value={aluno.cpf}
            onChange={handleChange}
            required
          />

          <label className="input-title">Endereço:</label>
          <input
            className="input-border"
            id=""
            type="text"
            name="endereco"
            value={aluno.endereco}
            onChange={handleChange}
            required
          />

          <label className="input-title">Instrutor:</label>
          <input
            className="input-border"
            id=""
            type="text"
            name="instrutorNome"
            value={aluno.instrutorNome}
            onChange={handleChange}
            required
          />

          <label className="input-title">Tipo de Carteira:</label>
          <input
            className="input-border"
            id=""
            type="text"
            name="tipoCarteira"
            value={aluno.tipoCarteira}
            onChange={handleChange}
            required
          />
        </form>
      </div>
    </div>
  );
  {
    /* coloca os label com for para determinar para cada um se refere, ACESSIBILIDADE */
  }
};

export default EditarAluno;
