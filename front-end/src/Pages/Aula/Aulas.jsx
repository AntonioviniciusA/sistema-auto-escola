import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";
import Search from "../../Components/Search";
import Filter from "../../Components/Filter";
import ModalConcluirAula from "../../Components/ModalConcluirAula";
import "./Aulas.css";
import Load_pages from "../../Components/Load_pages";
import FullScreen from "../../Components/FullScreenButton/FullScreenButton.jsx";
import { Printer } from "lucide-react";

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
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const fetchAulas = async () => {
      try {
        const response = await axios.get("https://sistemaautoescola.onrender.com/api/aula" ,
           { 
            headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
        setAulas(response.data);
      } catch (error) {
        console.error("Erro ao buscar aulas:", error);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
        }, 300);
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

  const handlePrint = () => {
    if (filteredAulas.length === 0) {
      alert("Não há aulas para imprimir com os filtros atuais!");
      return;
    }
  
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <style>
        @media print {
          body * {
            visibility: hidden;
            margin: 0;
            padding: 0;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 95%;
            padding: 5px;
            font-family: Arial, sans-serif;
            font-size: 12px;
          }
          .no-print {
            display: none !important;
          }
          .report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            table-layout: fixed;
          }
          .report-table th, .report-table td {
            border: 1px solid #000;
            padding: 4px;
            text-align: left;
            word-break: break-word;
          }
          .report-table th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
            font-size: 11px;
          }
          .header-print {
            text-align: center;
            margin-bottom: 10px;
            font-size: 14px;
            width: 100%;

          }
            .header-print p, strong{
            font-size: 16px;
            width: 100%;
            
            }
          .header-print h2 {
            margin-bottom: 5px;
            font-size: 16px;
            color: #333;
          }
          .filter-section {
            margin-bottom: 10px;
            padding: 8px;
            background-color: #f9f9f9;
            border-radius: 3px;
          }
          .filter-section p {
            margin: 3px 0;
            font-size: 11px;
          }
          @page {
            size: auto;
            margin: 5mm;
            orientation: portrait;
          }
        }
        @media print and (max-width: 600px) {
          .print-container {
            width: 100%;
            padding: 2px;
            font-size: 10px;
          }
          .report-table {
            display: block;
            overflow-x: auto;
          }
          .report-table th, .report-table td {
            padding: 3px;
            font-size: 9px;
            min-width: 60px;
          }
          .header-print h2 {
            font-size: 14px;
          }
        }
      </style>
      <div class="print-container">
        <div class="header-print">
          <h2>RELATÓRIO DE AULAS FILTRADAS</h2>
          <p>Total de aulas encontradas: <strong  >${filteredAulas.length}</strong></p>
        </div>
        
        <div class="filter-section">
          <p><strong>FILTROS APLICADOS:</strong></p>
          <p>• Data: ${filtros.data || 'Todas'}</p>
          <p>• Aluno: ${filtros.aluno || 'Todos'}</p>
          <p>• Instrutor: ${filtros.instrutor || 'Todos'}</p>
        </div>
        
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 20%;">Data/Hora</th>
              <th style="width: 15%;">Instrutor</th>
              <th style="width: 15%;">Aluno</th>
              <th style="width: 15%;">Veículo</th>
              <th style="width: 10%;">Placa</th>
              <th style="width: 10%;">Status</th>
              <th style="width: 15%;">Duração</th>
            </tr>
          </thead>
          <tbody>
            ${filteredAulas.map(aula => `
              <tr>
                <td>${new Date(aula.data).toLocaleString("pt-BR", {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</td>
                <td>${aula.instrutorNome || "-"}</td>
                <td>${aula.alunoNome || "-"}</td>
                <td>${aula.veiculoMarca ? `${aula.veiculoMarca}` : "-"}</td>
                <td style="text-transform: uppercase;">${aula.veiculoPlaca || "-"}</td>
                <td>${aula.status || "-"}</td>
                <td>${aula.tipo === "dupla" ? "100min" : "50min"}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 10px; font-size: 12px; text-align: right;">
          Gerado em: ${new Date().toLocaleString("pt-BR", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    `;
  
    document.body.appendChild(printContent);
    window.print();
    document.body.removeChild(printContent);
  };

  const concluirAula = async () => {
    if (!aulaSelecionada) return;

    try {
      fecharModal();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao concluir aula:", error);
      alert("Não foi possível concluir a aula. Tente novamente.");
    }
  };

  if (isRefreshing) {
    return <Load_pages />;
  }

  return (
    <div className="cadastro-aluno">
      <FullScreen />
      <h1 className="titletop">Aulas</h1>

      <div className="header-aulas">
        <div className="position-search-filter-aula">
          <Search
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Filter setFiltros={setFiltros} />
          <button
            className="btn-schedule"
            onClick={() => navigate("/agendamento")}
          >
            Agendar Aula
          </button>
          <button 
            onClick={handlePrint} 
            className="btn-print"
            title="Imprimir aulas filtradas"
          >
            <Printer size={18} />
          </button>
        </div>
      </div>

      {/* Header de pesquisa Para Mobile */}
      <div className="header-mobile">
        <div className="position-search-filter">
          <Search
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="btn-container">
            <Filter className="btn-filter" setFiltros={setFiltros} />
            <button
              className="btn-schedule"
              onClick={() => navigate("/agendamento")}
            >
              Agendar Aula
            </button>
            <button 
              onClick={handlePrint} 
              className="btn-print"
              title="Imprimir aulas filtradas"
            >
              <Printer size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="appointment-list">
        {filteredAulas.length === 0 ? (
          <div className="ctn-pay-aula">
            <div className="not-pay">
              <FaExclamationTriangle size={20} className="piscar" />
              <p>Não há aulas disponíveis.</p>
            </div>
          </div>
        ) : (
          <div className="container-filtered">
            {filteredAulas.map((aula) => (
              <div key={aula._id} className="appointment-item">
                <div className="headerappoiment-item">
                  <button onClick={() => handleAulaClick(aula._id)}>
                    <FaEye size={18} />
                  </button>
                  {aula.status === "agendada" && (
                    <button
                      className="btn-concluir-aula"
                      onClick={() => abrirModal(aula)}
                    >
                      Concluir Aula
                    </button>
                  )}
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
                <p>
                  <strong>Veiculo:</strong> {aula.veiculoMarca}{" "}
                  {aula.veiculoModelo} - {aula.veiculoPlaca}
                </p>
                <div className="bottomappoiment-item"></div>
              </div>
            ))}
          </div>
        )}
      </div>

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