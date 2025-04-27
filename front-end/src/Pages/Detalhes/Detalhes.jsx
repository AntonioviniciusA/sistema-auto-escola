import { useState, useEffect } from "react";
import { FaSave, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Load_pages from "../../Components/Load_pages";
import FullScreen from "../../Components/FullScreenButton/FullScreenButton.jsx";
import "./Detalhes.css";

// Configuração de horários de trabalho (em UTC)
const workingHours = [
  { start: 9, end: 15 }, // 06:00-12:00 BRT → 09:00-15:00 UTC
  { start: 16, end: 25 }, // 13:00-22:00 BRT → 16:00-01:00 UTC
];

const Detalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    aula: {
      _id: "",
      descricao: "",
      data: "",
      horario: "",
      tipo: "",
      instrutor: null,
      aluno: null,
      status: "",
      duracao: 50,
    },
    instructors: [],
    occupiedSlots: [],
    isEditing: false,
    isRefreshing: true,
  });

  // Buscar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [aulaResponse, instructorsResponse] = await Promise.all([
          axios.get(`https://sistemaautoescola.onrender.com/api/aula/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            "https://sistemaautoescola.onrender.com/api/instrutores/getall",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        const aulaData = aulaResponse.data;
        const aulaDate = new Date(aulaData.data);

        setState((prev) => ({
          ...prev,
          aula: {
            _id: aulaData._id,
            descricao: aulaData.descricao,
            data: aulaDate.toISOString().split("T")[0],
            horario: aulaDate.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            tipo: aulaData.tipo,
            instrutor: aulaData.instrutor,
            aluno: aulaData.aluno,
            status: aulaData.status,
            duracao: aulaData.tipo === "dupla" ? 100 : 50,
          },
          instructors: instructorsResponse.data,
          isRefreshing: false,
        }));

        // Carregar horários ocupados se já tiver instrutor
        if (aulaData.instrutor) {
          fetchOccupiedSlots(aulaData.instrutor._id);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Erro ao carregar dados da aula");
        setState((prev) => ({ ...prev, isRefreshing: false }));
      }
    };

    fetchData();
  }, [id]);

  // Buscar horários ocupados quando o instrutor muda
  const fetchOccupiedSlots = async (instructorId) => {
    try {
      const res = await axios.get(
        `https://sistemaautoescola.onrender.com/api/aula/instrutor/${instructorId}`
      );

      const aulasComDatasUTC = res.data
        .filter((aula) => aula._id !== state.aula._id) // Exclui a própria aula da lista de ocupados
        .map((aula) => ({
          ...aula,
          data: new Date(aula.data),
        }));

      setState((prev) => ({
        ...prev,
        occupiedSlots: aulasComDatasUTC,
      }));
    } catch (error) {
      toast.error("Erro ao buscar horários ocupados");
    }
  };

  // Gerar horários disponíveis
  const generateAvailableHours = () => {
    if (!state.aula.data || !state.aula.instrutor) return [];

    const selectedDateUTC = new Date(state.aula.data + "T00:00:00Z");
    const aulasNaData = state.occupiedSlots.filter((aula) => {
      const aulaDate = aula.data;
      return (
        aulaDate.getUTCFullYear() === selectedDateUTC.getUTCFullYear() &&
        aulaDate.getUTCMonth() === selectedDateUTC.getUTCMonth() &&
        aulaDate.getUTCDate() === selectedDateUTC.getUTCDate()
      );
    });

    const allOccupied = aulasNaData.map((a) => a.data);

    return workingHours.flatMap((period) => {
      const startUTC = new Date(
        Date.UTC(
          selectedDateUTC.getUTCFullYear(),
          selectedDateUTC.getUTCMonth(),
          selectedDateUTC.getUTCDate(),
          period.start,
          0
        )
      );

      const endUTC = new Date(
        Date.UTC(
          selectedDateUTC.getUTCFullYear(),
          selectedDateUTC.getUTCMonth(),
          selectedDateUTC.getUTCDate(),
          period.end,
          0
        )
      );

      const slots = [];
      let current = new Date(startUTC);

      while (current < endUTC) {
        const isOccupied = allOccupied.some(
          (ocupado) =>
            ocupado.getUTCHours() === current.getUTCHours() &&
            ocupado.getUTCMinutes() === current.getUTCMinutes()
        );

        if (!isOccupied) {
          const horaLocal = current.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "America/Sao_Paulo",
          });
          slots.push(horaLocal);
        }

        current = new Date(current.getTime() + 50 * 60000);
      }

      return slots;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      aula: {
        ...prev.aula,
        [name]: value,
      },
    }));
  };

  const handleInstructorChange = (e) => {
    const instructorId = e.target.value;
    const instructor = state.instructors.find((i) => i._id === instructorId);

    setState((prev) => ({
      ...prev,
      aula: {
        ...prev.aula,
        instrutor: instructor,
        horario: "", // Resetar horário ao mudar instrutor
      },
    }));

    if (instructorId) {
      fetchOccupiedSlots(instructorId);
    }
  };

  const editarAula = () => {
    setState((prev) => ({ ...prev, isEditing: true }));
    toast.success("Modo edição ativado! Faça as alterações desejadas.");
  };

  const salvarAula = async (e) => {
    e.preventDefault();

    try {
      // Criar a data/hora combinando data e horário
      const datetime = new Date(`${state.aula.data}T${state.aula.horario}:00`);
      // Preparar os dados para enviar
      const aulaData = {
        data: datetime,
        tipo: state.aula.duracao === 100 ? "dupla" : "simples",
        instrutor: state.aula.instrutor?._id, // Envia apenas o ID do instrutor
        aluno: state.aula.aluno?._id, // Envia apenas o ID do aluno
        status: state.aula.status,
      };
      // console.log(aulaData)
      await axios.put(
        `https://sistemaautoescola.onrender.com/api/aula/attclass/${id}`,
        aulaData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Aula atualizada com sucesso!");
      navigate("/aulas");
    } catch (error) {
      console.error("Erro ao atualizar aula:", error);
      toast.error("Erro ao atualizar aula");
    }
  };

  const deletarAula = async () => {
    if (window.confirm("Tem certeza que deseja apagar esta aula?")) {
      try {
        await axios.delete(
          `https://sistemaautoescola.onrender.com/api/aula/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Aula apagada com sucesso!");
        navigate("/aulas");
      } catch (error) {
        toast.error("Erro ao apagar aula");
        console.error(error);
      }
    }
  };

  if (state.isRefreshing) {
    return <Load_pages />;
  }

  const availableHours = generateAvailableHours();

  return (
    <main>
      <ToastContainer position="top-right" autoClose={3000} />

      <FullScreen />
      <h1>Detalhes da Aula</h1>
      <div className="header-details">
        <div className="ctn-buttons">
          {state.isEditing ? (
            <button onClick={salvarAula} className="size-btns">
              <FaSave className="icon" size={20} />
            </button>
          ) : (
            <button onClick={editarAula} className="size-btns">
              <FaEdit className="icon" size={20} />
            </button>
          )}
          <button
            onClick={deletarAula}
            className="size-btns"
            style={{ backgroundColor: "red", color: "white" }}
          >
            <FaTrash className="icon" size={20} />
          </button>
        </div>
      </div>
      <div className="ctn-details-bg">
        <div className="container-grid">
          <div className="card-data">
            <label className="input-title">Instrutor:</label>
            {state.isEditing ? (
              <select
                className="select-border"
                name="instrutor"
                onChange={handleInstructorChange}
                value={state.aula.instrutor?._id || ""}
              >
                <option value="">Selecione o Instrutor</option>
                {state.instructors.map((instructor) => (
                  <option key={instructor._id} value={instructor._id}>
                    {instructor.usuario}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="input-border"
                type="instrutor"
                name="instrutor"
                value={state.aula.instrutor?.usuario || "N/A"}
                onChange={handleChange}
                disabled
              />
            )}
          </div>

          <div className="card-data">
            <label className="input-title">Data:</label>
            {state.isEditing ? (
              <input
                className="input-border-date"
                type="date"
                name="data"
                value={state.aula.data}
                onChange={handleChange}
                disabled={!state.isEditing}
              />
            ) : (
              <input
                className="input-border"
                type="date"
                name="data"
                value={state.aula.data}
                onChange={handleChange}
                disabled
              />
            )}
          </div>

          <div className="card-data">
            <label className="input-title">Horário:</label>
            {state.isEditing ? (
              <select
                className="select-border"
                name="horario"
                value={state.aula.horario}
                onChange={handleChange}
                disabled={!state.aula.data || !state.aula.instrutor}
              >
                <option value="">Selecione o horário</option>
                {availableHours.map((horario) => (
                  <option key={horario} value={horario}>
                    {horario}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="input-border"
                type="horario"
                name="horario"
                value={state.aula.horario}
                onChange={handleChange}
                disabled
              />
            )}
          </div>

          <div className="card-data">
            <label className="input-title">Aluno:</label>
            <input
              className="input-border"
              type="name"
              name="name"
              value={state.aula.aluno?.nome || "N/A"}
              onChange={handleChange}
              disabled
            />
          </div>

          <div className="card-data">
            <label className="input-title">Status:</label>
            {state.isEditing ? (
              <select
                className="select-border"
                name="status"
                onChange={handleChange}
                value={state.aula.status}
              >
                <option value="agendada">Agendada</option>
                <option value="cancelada">Cancelada</option>
                <option value="pendente">Pendente</option>
                <option value="concluida">Concluída</option>
              </select>
            ) : (
              <input
                className="input-border"
                type="status"
                name="status"
                value={state.aula.status}
                onChange={handleChange}
                disabled
              />
            )}
          </div>

          <div className="card-data">
            <label className="input-title">Duração:</label>
            {state.isEditing ? (
              <select
                className="select-border"
                name="duracao"
                value={state.aula.duracao}
                onChange={handleChange}
              >
                <option value={50}>50 minutos (Simples)</option>
                <option value={100}>100 minutos (Dupla)</option>
              </select>
            ) : (
              <input
                className="input-border"
                type="duracao"
                name="duracao"
                value={`${state.aula.duracao} minutos`}
                onChange={handleChange}
                disabled
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Detalhes;
