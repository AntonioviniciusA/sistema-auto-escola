import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CadastroAluno.css";
import axios from "axios";
import Load_pages from "../../Components/Load_pages";
import FullScreen from "../../Components/FullScreenButton/FullScreenButton.jsx";
import { ToastContainer, toast } from "react-toastify";
import { UserPlus } from "lucide-react";

const CadastroAluno = () => {
  const navigate = useNavigate();
  const [aluno, setAluno] = useState({
    nome: "",
    codehash: "",
    telefone: "",
    dataNascimento: "",
    cpf: "",
    rg: "",
    endereco: "",
    instrutor: "",
    tipoCarteira: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [instructorSuggestions, setInstructorSuggestions] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(true);

  // Funções de formatação
  const formatPhone = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };
  const formatRG = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  // Handlers de mudança
  const handlePhoneChange = (e) => {
    setAluno({ ...aluno, telefone: formatPhone(e.target.value) });
  };

  const handleCPFChange = (e) => {
    setAluno({ ...aluno, cpf: formatCPF(e.target.value) });
  };

  const handleRGChange = (e) => {
    setAluno({ ...aluno, rg: formatRG(e.target.value) });
  };

  const validate = () => {
    if (
      !aluno.nome.trim() ||
      !aluno.email.trim() ||
      !aluno.telefone.trim() ||
      !aluno.cpf.trim() ||
      !aluno.endereco.trim() ||
      !aluno.instrutor.trim()
    ) {
      toast.error("Por favor, preencha todos os campos corretamente.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    buscarDados();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 300);
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setError("");
    try {
      const response = await fetch(
        "https://sistemaautoescola.onrender.com/api/alunos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(aluno),
        }
      );

      if (response.ok) {
        const result = await response.json();
        navigate("/Alunos");
      } else {
        console.error("Erro ao salvar aluno:", response.statusText);
      }
    } catch (error) {
      console.error("Erro na conexão com o servidor:", error);
    }
  };

  if (isRefreshing) {
    return <Load_pages />;
  }

  return (
    <div className="container-Cadastro-aluno">
      <ToastContainer position="top-right" autoClose={3000} />

      <FullScreen />
      <h1 className="title">Cadastro de Alunos</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="ctn-bg">
        <div className="ctn-header-register">
          <button type="submit" className="btn-cadastro">
            <UserPlus size={22} className="text-white" />
            Cadastrar
          </button>
        </div>

        <div className="ctn-grid">
          <div className="box-data p1">
            <label htmlFor="nome" className="label-title">
              Nome:
            </label>
            <input
              id="input-nome"
              className="bd-input"
              type="text"
              name="nome"
              value={aluno.nome}
              onChange={(e) => setAluno({ ...aluno, nome: e.target.value })}
              placeholder="Digite o nome"
            />
          </div>

          <div className="box-data p5">
            <label htmlFor="codehash" className="label-title">
              Matrícula:
            </label>
            <input
              id="input-codehash"
              type="text"
              className="bd-input"
              name="codehash"
              value={aluno.codehash}
              onChange={(e) => setAluno({ ...aluno, codehash: e.target.value })}
              placeholder="Digite a matrícula"
            />
          </div>

          <div className="box-data p6">
            <label htmlFor="telefone" className="label-title">
              Telefone:
            </label>
            <input
              id="input-telefone"
              type="text"
              className="bd-input"
              name="telefone"
              value={aluno.telefone}
              onChange={handlePhoneChange}
              placeholder="(dd) 99999-9999"
              maxLength="15"
            />
          </div>

          <div className="box-data p2">
            <label htmlFor="dataNascimento" className="label-title">
              Data de Nascimento:
            </label>
            <input
              className="bd-input-date"
              id="input-data-nascimento"
              type="date"
              name="dataNascimento"
              value={aluno.dataNascimento}
              onChange={(e) =>
                setAluno({ ...aluno, dataNascimento: e.target.value })
              }
            />
          </div>

          <div className="box-data p3">
            <label htmlFor="cpf" className="label-title">
              CPF:
            </label>
            <input
              id="input-cpf"
              type="text"
              className="bd-input"
              name="cpf"
              value={aluno.cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              maxLength="14"
            />
          </div>

          <div className="box-data p4">
            <label htmlFor="rg" className="input-title">
              RG:
            </label>
            <input
              className="input-border"
              id="rg"
              type="text"
              name="rg"
              placeholder="00.000.000-0"
              value={aluno.rg}
              onChange={handleRGChange}
              maxLength="14"
              required
            />
          </div>

          <div className="box-data p8">
            <label htmlFor="endereco" className="label-title">
              Endereço:
            </label>
            <input
              id="input-endereco"
              type="text"
              className="bd-input"
              name="endereco"
              value={aluno.endereco}
              onChange={(e) => setAluno({ ...aluno, endereco: e.target.value })}
              placeholder="Digite o endereço"
            />
          </div>

          <div className="box-data p7">
            <label htmlFor="email" className="label-title">
              Email:
            </label>
            <input
              type="email"
              name="email"
              placeholder="Digite o e-mail"
              value={aluno.email}
              onChange={(e) => setAluno({ ...aluno, email: e.target.value })}
              className="bd-input"
              required
            />
          </div>

          <div className="box-data p9">
            <label htmlFor="instrutor" className="label-title">
              Selecione o Instrutor:
            </label>
            <select
              className="select-Cad"
              id="select-instrutor"
              onChange={(e) =>
                setAluno({ ...aluno, instrutor: e.target.value })
              }
              value={aluno.instrutor}
            >
              <option value="">Selecione o Instrutor</option>
              {instructorSuggestions.length > 0 ? (
                instructorSuggestions.map((instrutor) => (
                  <option key={instrutor._id} value={instrutor._id}>
                    {instrutor.usuario} - {instrutor.email}
                  </option>
                ))
              ) : (
                <option>Carregando instrutores...</option>
              )}
            </select>
          </div>

          <div className="box-data p10">
            <label htmlFor="tipoCarteira" className="label-title">
              Tipo de Carteira:
            </label>
            <select
              className="select-Cad"
              id="tipoCarteira"
              name="tipoCarteira"
              value={aluno.tipoCarteira}
              onChange={(e) =>
                setAluno({ ...aluno, tipoCarteira: e.target.value })
              }
            >
              <option value="">Selecione:</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="B">AB</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn-cadastro-mobile">
        <UserPlus size={18} /> Cadastrar
        </button>
      </form>
    </div>
  );
};

export default CadastroAluno;
