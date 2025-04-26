import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Importando navigate
import "./CadastroAluno.css";
import axios from "axios";

const CadastroAluno = () => {
  const navigate = useNavigate(); // Inicializando navigate
  const [aluno, setAluno] = useState({
    nome: "",
    codehash: "",
    telefone: "",
    dataNascimento: "",
    cpf: "",
    endereco: "",
    instrutor: "", // Agora armazenará apenas o ID
    tipoCarteira: "",
  });
  const [error, setError] = useState("");
  const [instructorSuggestions, setInstructorSuggestions] = useState([]);

  useEffect(() => {
    buscarDados();
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
      console.log("Instrutores carregados:", instrutores.data);
    } catch (error) {
      toast.error("Erro ao Buscar Instrutores.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se todos os campos estão preenchidos
    for (let key in aluno) {
      if (!aluno[key]) {
        setError("Todos os campos devem ser preenchidos");
        return;
      }
    }

    setError("");
    try {
      const response = await fetch("https://sistemaautoescola.onrender.com/api/alunos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aluno),
      });

      console.log("Resposta do servidor:", response);
      console.log("Dados enviados:", aluno);

      if (response.ok) {
        const result = await response.json();
        console.log("Aluno salvo com sucesso:", result);
        navigate("/Alunos");
      } else {
        console.error("Erro ao salvar aluno:", response.statusText);
      }
    } catch (error) {
      console.error("Erro na conexão com o servidor:", error);
    }
  };

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, "") // Remove tudo que não for número
      .replace(/(\d{3})(\d)/, "$1.$2") // Adiciona o primeiro ponto
      .replace(/(\d{3})(\d)/, "$1.$2") // Adiciona o segundo ponto
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2") // Adiciona o traço
      .slice(0, 14); // Limita ao tamanho máximo do CPF
  };

  const handleCPFChange = (e) => {
    setAluno({ ...aluno, cpf: formatCPF(e.target.value) });
  };

  return (
    <div className="container-Cadastro-aluno">
      <h1 className="title">Cadastro de Alunos</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form">
        <h2 className="title-age">Nome:</h2>

        <input
          id="input-nome"
          className="input-name-aula"
          type="text"
          name="nome"
          value={aluno.nome}
          onChange={(e) => setAluno({ ...aluno, nome: e.target.value })}
          placeholder="Nome"
        />
        <h2 className="title-age">Codehash:</h2>
        <input
          id="input-codehash"
          type="text"
          className="input-name-aula"
          name="codehash"
          value={aluno.codehash}
          onChange={(e) => setAluno({ ...aluno, codehash: e.target.value })}
          placeholder="Codehash"
        />
        <h2 className="title-age">Telefone:</h2>

        <input
          id="input-telefone"
          type="text"
          className="input-name-aula"
          name="telefone"
          value={aluno.telefone}
          onChange={(e) => setAluno({ ...aluno, telefone: e.target.value })}
          placeholder="Telefone"
        />
        <h2 className="title-age">Data de Nascimento:</h2>

        <input
          id="input-data-nascimento"
          type="date"
          className="input-data-aluno"
          name="dataNascimento"
          value={aluno.dataNascimento}
          onChange={(e) =>
            setAluno({ ...aluno, dataNascimento: e.target.value })
          }
        />
        <h2 className="title-age">CPF:</h2>
        <input
          id="input-cpf"
          type="text"
          className="input-name-aula"
          name="cpf"
          value={aluno.cpf}
          onChange={handleCPFChange}
          placeholder="CPF"
        />

        <h2 className="title-age">Endereço:</h2>

        <input
          id="input-endereco"
          type="text"
          className="input-name-aula"
          name="endereco"
          value={aluno.endereco}
          onChange={(e) => setAluno({ ...aluno, endereco: e.target.value })}
          placeholder="Endereço"
        />
        <br />

        <select
          className="select-age"
          id="select-instrutor"
          onChange={(e) => setAluno({ ...aluno, instrutor: e.target.value })}
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

        <br />
        <select
          id="select-carteira"
          name="tipoCarteira"
          value={aluno.tipoCarteira}
          onChange={(e) => setAluno({ ...aluno, tipoCarteira: e.target.value })}
        >
          <option value="">Selecione o tipo de carteira</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="AB">AB</option>
        </select>
        <br />

        <button type="submit" className="Cadastrarbtn">
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default CadastroAluno;
