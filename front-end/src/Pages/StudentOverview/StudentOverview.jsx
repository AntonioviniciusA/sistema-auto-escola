import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaSave, FaEdit, FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./StudentOverview.css";
import Load_pages from "../../Components/Load_pages";
import AulasMap from "../../Components/Aulamap";
import Payments from "../../Components/PaymentsSection";
import GerarContrato from "../../Components/ContractGenerator";
import DeletModalstdent from "../../Components/DeletstudentModal";
import FullScreen from "../../Components/FullScreenButton/FullScreenButton.jsx";

const EditarAluno = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aluno, setAluno] = useState({
    nome: "",
    telefone: "",
    dataNascimento: "",
    cpf: "",
    rg: "",
    endereco: "",
    instrutor: "",
    tipoCarteira: "",
    instrutorNome: "",
    email: "",
  });
  const [aulas] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("alunos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [instructorSuggestions, setInstructorSuggestions] = useState([]);

  // Funções de formatação
  const formatarCPF = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    if (value.length <= 3) return value;
    if (value.length <= 6) return `${value.slice(0, 3)}.${value.slice(3)}`;
    if (value.length <= 9)
      return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(
      6,
      9
    )}-${value.slice(9, 11)}`;
  };

  const formatarRG = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    if (value.length <= 2) return value;
    if (value.length <= 5) return `${value.slice(0, 2)}.${value.slice(2)}`;
    if (value.length <= 8)
      return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(
      5,
      8
    )}-${value.slice(8, 9)}`;
  };

  const formatarTelefone = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    if (value.length <= 2) return `(${value}`;
    if (value.length <= 6) return `(${value.slice(0, 2)}) ${value.slice(2)}`;
    return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
  };

  const parseDateString = (dateString) => {
    if (!dateString) return null;

    // Se já está no formato ISO (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Se está no formato DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    // Se é uma string de data ISO com timezone
    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }

    return dateString;
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";

    const parsedDate = parseDateString(dateString);
    if (!parsedDate) return "";

    const [year, month, day] = parsedDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleChangeFormatado = (e) => {
    const { name, value } = e.target;

    if (name === "cpf") {
      const formattedValue = formatarCPF(value);
      setAluno({ ...aluno, [name]: formattedValue });
    } else if (name === "rg") {
      const formattedValue = formatarRG(value);
      setAluno({ ...aluno, [name]: formattedValue });
    } else if (name === "telefone") {
      const formattedValue = formatarTelefone(value);
      setAluno({ ...aluno, [name]: formattedValue });
    } else {
      setAluno({ ...aluno, [name]: value });
    }
  };

  useEffect(() => {
    buscarDados();
    const fetchData = async () => {
      try {
        const responseAluno = await axios.get(
          `https://sistemaautoescola.onrender.com/api/alunos/${id}`
        );

        // Formata os dados recebidos do backend
        const alunoFormatado = {
          ...responseAluno.data,
          cpf: formatarCPF(responseAluno.data.cpf),
          rg: formatarRG(responseAluno.data.rg),
          telefone: formatarTelefone(responseAluno.data.telefone),
          dataNascimento: parseDateString(responseAluno.data.dataNascimento),
        };

        setAluno(alunoFormatado);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Erro ao buscar dados.");
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
        }, 300);
      }
    };

    fetchData();
  }, [id]);

  const EditarAluno = () => {
    setIsEditing(true);
    toast.success("Modo edição ativado! Faça as alterações desejadas.");
  };

  const salvarAluno = async (e) => {
    e.preventDefault();

    // Validação dos campos obrigatórios
    const requiredFields = [
      "nome",
      "telefone",
      "dataNascimento",
      "cpf",
      "rg",
      "endereco",
      "instrutor",
      "tipoCarteira",
    ];
    for (const field of requiredFields) {
      if (!aluno[field]) {
        toast.error(`O campo ${field} é obrigatório!`);
        return;
      }
    }

    // Remove formatação antes de enviar ao backend
    const alunoParaEnviar = {
      ...aluno,
      cpf: aluno.cpf.replace(/\D/g, ""),
      rg: aluno.rg.replace(/\D/g, ""),
      telefone: aluno.telefone.replace(/\D/g, ""),
      dataNascimento: formatDateForDisplay(aluno.dataNascimento), // Envia no formato DD/MM/YYYY
    };

    try {
      await axios.put(
        `https://sistemaautoescola.onrender.com/api/alunos/${id}`,
        alunoParaEnviar
      );
      toast.success("Aluno atualizado com sucesso!");
      setIsEditing(false);

      // Recarrega os dados atualizados
      const response = await axios.get(
        `https://sistemaautoescola.onrender.com/api/alunos/${id}`
      );
      setAluno({
        ...response.data,
        cpf: formatarCPF(response.data.cpf),
        rg: formatarRG(response.data.rg),
        telefone: formatarTelefone(response.data.telefone),
        dataNascimento: parseDateString(response.data.dataNascimento),
      });
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      if (error.response) {
        toast.error(
          `Erro: ${error.response.data.message || "Erro ao atualizar aluno"}`
        );
      } else {
        toast.error("Erro de conexão com o servidor");
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        await axios.delete(
          `https://sistemaautoescola.onrender.com/api/alunos/delete/${id}`
        );
        toast.success("Aluno excluído com sucesso!");
        setTimeout(() => navigate("/alunos"), 2000);
      } catch (error) {
        toast.error("Erro ao excluir aluno.");
      }
    }
  };

  const buscarDados = async () => {
    const token = localStorage.getItem("token");
    try {
      const instrutores = await axios.get(
        "https://sistemaautoescola.onrender.com/api/instrutores/getall",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInstructorSuggestions(instrutores.data);
    } catch (error) {
      toast.error("Erro ao Buscar Instrutores.");
    }
  };

  if (isRefreshing) {
    return <Load_pages />;
  }

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <header id="no-print">
        <FullScreen />
        <h1 id="title">Detalhes do Aluno</h1>
      </header>
      <div className="section-nav" id="no-print">
        <button
          onClick={() => setActiveSection("alunos")}
          className={`nav-button ${activeSection === "alunos" ? "active" : ""}`}
        >
          Aluno
        </button>
        <button
          onClick={() => setActiveSection("aulas")}
          className={`nav-button ${activeSection === "aulas" ? "active" : ""}`}
        >
          Aulas
        </button>
        <button
          onClick={() => setActiveSection("pagamentos")}
          className={`nav-button ${
            activeSection === "pagamentos" ? "active" : ""
          }`}
        >
          Pagamentos
        </button>
        <button
          onClick={() => setActiveSection("contrato")}
          className={`nav-button ${
            activeSection === "contrato" ? "active" : ""
          }`}
        >
          Contrato
        </button>
      </div>

      <div className="containerend">
        {activeSection === "alunos" && (
          <div className="container-bg">
            <div className="container-btns" id="no-print">
              <div className="ctn-btns">
                {isEditing ? (
                  <button
                    onClick={salvarAluno}
                    className="size-buttons btn-save"
                  >
                    <FaSave className="icone" size={20} />
                  </button>
                ) : (
                  <button
                    onClick={EditarAluno}
                    className=" btn-editer size-buttons"
                  >
                    <FaEdit className="icone" size={20} />
                  </button>
                )}
                <button
                  onClick={handleOpenModal}
                  className="size-buttons btn-deleted"
                >
                  <FaTrash className="icone" size={20} />
                </button>
              </div>
            </div>
            <div className="info-grid" id="no-print">
              <DeletModalstdent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onDelete={handleDelete}
              />
              <div className="card-data">
                <label htmlFor="nome" className="input-title">
                  Nome:
                </label>
                <input
                  className="input-border"
                  id="nome"
                  type="text"
                  name="nome"
                  value={aluno.nome}
                  onChange={handleChangeFormatado}
                  required
                  disabled={!isEditing}
                />
              </div>
              <div className="card-data">
                <label htmlFor="telefone" className="input-title">
                  Telefone:
                </label>
                <input
                  className="input-border"
                  id="telefone"
                  type="text"
                  name="telefone"
                  value={aluno.telefone}
                  onChange={handleChangeFormatado}
                  maxLength={15}
                  placeholder="(00) 00000-0000"
                  required
                  disabled={!isEditing}
                />
              </div>
              <div className="card-data">
                <label htmlFor="dataNascimento" className="input-title">
                  Data de Nascimento:
                </label>
                {isEditing ? (
                  <input
                    className="input-border-date"
                    id="dataNascimento"
                    type="date"
                    name="dataNascimento"
                    value={aluno.dataNascimento || ""}
                    onChange={handleChangeFormatado}
                    required
                  />
                ) : (
                  <p className="given">
                    {formatDateForDisplay(aluno.dataNascimento)}
                  </p>
                )}
              </div>
              <div className="card-data">
                <label htmlFor="cpf" className="input-title">
                  CPF:
                </label>
                <input
                  className="input-border"
                  id="cpf"
                  type="text"
                  name="cpf"
                  value={aluno.cpf}
                  onChange={handleChangeFormatado}
                  maxLength={14}
                  placeholder="000.000.000-00"
                  required
                  disabled={!isEditing}
                />
              </div>
              <div className="card-data">
                <label htmlFor="rg" className="input-title">
                  RG:
                </label>
                <input
                  className="input-border"
                  id="rg"
                  type="text"
                  name="rg"
                  value={aluno.rg}
                  onChange={handleChangeFormatado}
                  maxLength={14}
                  placeholder="000.000.000-00"
                  required
                  disabled={!isEditing}
                />
              </div>
              <div className="card-data">
                <label htmlFor="endereco" className="input-title">
                  Endereço:
                </label>
                <input
                  className="input-border"
                  id="endereco"
                  type="text"
                  name="endereco"
                  value={aluno.endereco}
                  onChange={handleChangeFormatado}
                  required
                  disabled={!isEditing}
                />
              </div>
              <div className="card-data">
                <label htmlFor="instrutor" className="input-title">
                  Instrutor:
                </label>
                {isEditing ? (
                  <select
                    className="select-border"
                    id="instrutor"
                    name="instrutor"
                    value={aluno.instrutor || ""}
                    onChange={handleChangeFormatado}
                    required
                  >
                    <option value="">Selecione o Instrutor</option>
                    {instructorSuggestions.map((instrutor) => (
                      <option key={instrutor._id} value={instrutor._id}>
                        {instrutor.usuario}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="given">{aluno.instrutorNome}</p>
                )}
              </div>
              <div className="card-data">
                <label htmlFor="tipoCarteira" className="input-title">
                  Tipo de Carteira:
                </label>
                {isEditing ? (
                  <select
                    className="select-border"
                    id="tipoCarteira"
                    name="tipoCarteira"
                    value={aluno.tipoCarteira || ""}
                    onChange={handleChangeFormatado}
                    required
                  >
                    <option value="">Selecione:</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="AB">AB</option>
                  </select>
                ) : (
                  <p className="given">{aluno.tipoCarteira}</p>
                )}
              </div>
              <div className="card-data">
                <label htmlFor="email" className="input-title">
                  E-mail:
                </label>
                <input
                  className="input-border"
                  id="email"
                  type="text"
                  name="email"
                  value={aluno.email || "Não Informado"}
                  onChange={handleChangeFormatado}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        )}
        {activeSection === "aulas" && <AulasMap aulas={aulas} />}
        {activeSection === "pagamentos" && <Payments id={id} />}
        {activeSection === "contrato" && (
          <GerarContrato aluno={aluno} id={id} />
        )}
      </div>
    </div>
  );
};

export default EditarAluno;
