import { useState, useEffect } from "react";
import { FaSave, FaEdit, FaUserPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Detalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aula, setAula] = useState({
    descricao: "",
    data: "",
    horario: "",
    tipo: "",
    instrutor: "",
    aluno: "",
    status: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [addingAluno, setAddingAluno] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);

  useEffect(() => {
    const puxarAulas = async () => {
      try {
        const response = await axios.get(
          `https://sistemaautoescola.onrender.com/api/aula/${id}`
        );
        const data = response.data; // axios já retorna JSON, não precisa de .json()
        setAula({
          descricao: data.descricao,
          data: data.data,
          horario: data.horario,
          tipo: data.tipo,
          instrutor: data.instrutor.usuario, // Ajustado para acessar o nome do instrutor
          aluno: data.aluno.nome, // Ajustado para acessar o nome do aluno
          status: data.status,
        });
        console.log(data);
      } catch (error) {
        console.error("Erro ao buscar aula:", error);
      }
    };

    puxarAulas();
  }, [id]);

  if (!aula) {
    return <p>Carregando...</p>;
  }

  const handleChange = (e) => {
    setAula({ ...aula, [e.target.name]: e.target.value });
  };

  const adicionarAluno = () => {
    if (alunoSelecionado) {
      setAula((prevState) => ({
        ...prevState,
        aluno: alunoSelecionado, // Substitui o aluno selecionado
      }));
      setAlunoSelecionado(null);
      setAddingAluno(false);
    }
  };

  const editarAula = () => {
    setIsEditing(true);
    toast.success("Modo edição ativado! Faça as alterações desejadas.");
  };

  const salvarAula = async (e) => {
    setIsEditing(false);
    e.preventDefault();
    try {
      await axios.put(`https://sistemaautoescola.onrender.com/api/aula/${id}`, aula);
      toast.success("Alterações da aula salvas!");
      navigate("/aulas");
    } catch (error) {
      toast.error("Erro ao atualizar aula");
      console.error(error);
    }
  };

  return (
    <main>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container-bg">
        <h1>Detalhes da Aula</h1>
        <header className="hdr-details">
          {isEditing ? (
            <button onClick={salvarAula}>
              <FaSave className="icon" size={20} /> Salvar Alterações
            </button>
          ) : (
            <button onClick={editarAula}>
              <FaEdit className="icon" size={20} /> Editar Aula
            </button>
          )}

          <button onClick={() => setAddingAluno(true)}>
            <FaUserPlus className="icon" size={20} /> Adicionar Aluno
          </button>
        </header>
        <div>
          <h2>Informações da Aula</h2>
          <p>
            <strong>Instrutor:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                value={aula.instrutor}
                onChange={handleChange}
                name="instrutorNome"
              />
            ) : (
              aula.instrutor
            )}
          </p>
          <p>
            <strong>Data:</strong>{" "}
            {isEditing ? (
              <input
                type="date"
                value={aula.data}
                onChange={handleChange}
                name="data"
              />
            ) : (
              new Date(aula.data).toLocaleDateString()
            )}
          </p>
          <p>
            <strong>Horário:</strong>{" "}
            {isEditing ? (
              <input
                type="time"
                value={aula.horario}
                onChange={handleChange}
                name="horario"
              />
            ) : (
              aula.horario
            )}
          </p>
          <p>
            <strong>Duração:</strong>{" "}
            {aula.tipo === "dupla" ? "100 min" : "50 min"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                value={aula.status}
                onChange={handleChange}
                name="status"
              />
            ) : (
              aula.status
            )}
          </p>
        </div>
        <div className="AlunoContainer">
          {addingAluno && (
            <div>
              <Search
                type="text"
                placeholder="Buscar Aluno"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && alunosFiltrados.length > 0 && (
                <ul>
                  {alunosFiltrados.map((aluno) => (
                    <li key={aluno.id}>
                      <button onClick={() => setAlunoSelecionado(aluno)}>
                        {aluno.nome}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {searchQuery && alunosFiltrados.length === 0 && (
                <p>Nenhum aluno encontrado.</p>
              )}
              {alunoSelecionado && (
                <div>
                  <p>Aluno Selecionado: {alunoSelecionado.nome}</p>
                  <button onClick={adicionarAluno}>Adicionar</button>
                  <button onClick={() => setAddingAluno(false)}>
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          )}
          {aula.aluno && (
            <p>
              <strong>Aluno:</strong> {aula.aluno}
            </p>
          )}
        </div>
      </div>
    </main>
  );
  // COLOCAR O INSTRUTOR PARA SER SELECIONADO IGUAL DA PAGINA DE AGENDAMENTO (COM <select>) OS ALUNOS TBM
  // COLOCAR padding NOS BOTOES
  // ORGANIZAR E DEIXAR MENOS ESPACOS VAZIOS
  // AUMENTAR OS TAMANHO DA FONTE DEPENDENDO DO DISPOSITIVO
};

export default Detalhes;
