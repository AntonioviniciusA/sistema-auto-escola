import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import Search from "../Components/Search";
import Filter from "../Components/Filter";
import ModalConcluirAula from "../Components/ModalConcluirAula"; // Importe o modal

import "./Aulas.css";

const Aulas = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [aulas, setAulas] = useState([]);
  const [filtros, setFiltros] = useState({
    data: "",
    aluno: "",
    instrutor: "",
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [aulaSelecionada, setAulaSelecionada] = useState(null);

  useEffect(() => {
    const fetchAulas = async () => {
      try {
        const response = await axios.get("https://sistemaautoescola.onrender.com/api/aula");
        setAulas(response.data);
      } catch (error) {
        console.error("Erro ao buscar aulas:", error);
      }
    };

    fetchAulas();
  }, []);

  const handleAulaClick = (aulaId) => {
    navigate(`/detalhes/${aulaId}`);
  };

  const abrirModal = (aula) => {
    setAulaSelecionada(aula);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setAulaSelecionada(null);
  };

  const concluirAula = async () => {
    try {
      const response = await axios.get("https://sistema-auto-escola-uy6r.vercel.app/api/aula");
      setAulas(response.data); // Atualiza a lista com o novo status
    } catch (error) {
      console.error("Erro ao atualizar lista de aulas", error);
    }
  };

  const filteredAulas = aulas.filter((aula) => {
    const lowerSearch = searchTerm.toLowerCase();
    const lowerAluno = filtros.aluno.toLowerCase();
    const lowerInstrutor = filtros.instrutor.toLowerCase();
    const dataFiltro = filtros.data;

    return (
      (aula.instrutorNome.toLowerCase().includes(lowerSearch) ||
        aula.alunoNome.toLowerCase().includes(lowerSearch) ||
        aula.data.includes(searchTerm)) &&
      (aula.data.includes(dataFiltro) || !dataFiltro) &&
      (aula.alunoNome.toLowerCase().includes(lowerAluno) || !lowerAluno) &&
      (aula.instrutorNome.toLowerCase().includes(lowerInstrutor) ||
        !lowerInstrutor)
    );
  });

  return (
    <div>
      <h1 className="titletop">Aulas</h1>

      <div className="headeraulas">
        <div className="position-search-filter">
          <Search
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Filter />
        </div>

        <button
          className="btn-schedule"
          onClick={() => navigate("/agendamento")}
        >
          Agendar Aula
        </button>
      </div>
      {/*<Filter filtros={filtros} setFiltros={setFiltros} />*/}
      <br />
      <div className="appointment-list">
        {filteredAulas.length === 0 ? (
          <p>Não há aulas disponíveis.</p>
        ) : (
          <div className="container-filtered">
            {filteredAulas.map((aula) => (
              <div key={aula._id} className="appointment-item">
                <div className="headerappoiment-item">
                  <button onClick={() => handleAulaClick(aula._id)}>
                    <FaEdit />
                  </button>
                </div>
                <p>
                  <strong>Instrutor:</strong> {aula.instrutorNome}
                </p>
                <p>
                  <strong>Data e Horário:</strong>{" "}
                  {new Date(aula.data).toLocaleString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>
                  <strong>Aluno:</strong> {aula.alunoNome}
                </p>
                <p>
                  <strong>Duração:</strong>{" "}
                  {aula.tipo === "dupla" ? "100 min" : "50 min"}
                </p>
                <p>
                  <strong>Status:</strong> {aula.status}
                </p>
                <div className="bottomappoiment-item">
                  <button onClick={() => abrirModal(aula)}>
                    Concluir Aula
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ModalConcluirAula
        isOpen={modalAberto}
        onClose={fecharModal}
        onConfirm={concluirAula}
        aulaSelecionada={aulaSelecionada}
      />
    </div>
  );
};

export default Aulas;
