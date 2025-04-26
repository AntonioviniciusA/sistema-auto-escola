import { useState, useEffect } from "react";
import axios from "axios";
import "./Filter.css";

const FiltroPesquisa = ({ setFiltros }) => {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtros, setLocalFiltros] = useState({
    data: "",
    aluno: "",
    instrutor: "",
  });
  const [alunos, setAlunos] = useState([]);
  const [instrutores, setInstrutores] = useState([]);

  // Buscar dados dos alunos e instrutores
  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await axios.get("https://sistemaautoescola.onrender.com/api/alunos");
        setAlunos(response.data);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };

    const fetchInstrutores = async () => {
      try {
        const response = await axios.get(
          "https://sistemaautoescola.onrender.com/api/instrutores/getall"
        );
        setInstrutores(response.data);
      } catch (error) {
        console.error("Erro ao buscar instrutores:", error);
      }
    };

    fetchAlunos();
    fetchInstrutores();
  }, []);

  // Alternar visibilidade dos filtros
  const toggleFiltros = () => {
    setMostrarFiltros(!mostrarFiltros);
  };

  // Atualizar filtros
  const handleChange = (e) => {
    const { id, value } = e.target;
    setLocalFiltros((prev) => {
      const newFiltros = { ...prev, [id]: value };
      setFiltros(newFiltros);
      return newFiltros;
    });
  };

  return (
    <div className="filtro-container">
      <button onClick={toggleFiltros} className="btn-filter">
        {mostrarFiltros ? "Fechar Filtros" : "Filtrar Pesquisa"}
      </button>

      <div className={`dropdown-container ${mostrarFiltros ? "show" : ""}`}>
        <label>Data:</label>
        <input
          type="date"
          id="data"
          value={filtros.data}
          onChange={handleChange}
        />

        <label>Aluno:</label>
        <select id="aluno" value={filtros.aluno} onChange={handleChange}>
          <option value="">Selecione o Aluno</option>
          {alunos.map((aluno) => (
            <option key={aluno._id} value={aluno._id}>
              {aluno.nome}
            </option>
          ))}
        </select>

        <label>Instrutor:</label>
        <select
          id="instrutor"
          value={filtros.instrutor}
          onChange={handleChange}
        >
          <option value="">Selecione o Instrutor</option>
          {instrutores.map((instrutor) => (
            <option key={instrutor._id} value={instrutor._id}>
              {instrutor.usuario}
            </option>
          ))}
        </select>

        <div className="dropdown-buttons">
          <button
            onClick={() => console.log("Filtros aplicados:", filtros)}
            className="apply-btn"
          >
            Aplicar
          </button>
          <button onClick={toggleFiltros} className="close-btn">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltroPesquisa;
