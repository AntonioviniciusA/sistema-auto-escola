import { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Load_pages from "../../Components/Load_pages";
import FullScreen from "../../Components/FullScreenButton/FullScreenButton.jsx";
import "./Agendamentos.css";

const Agendamento = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    instructor: null,
    vehicle: null,
    student: null,
    date: "",
    time: "",
    duration: 50,
    appointments: [],
    instructors: [],
    vehicles: [],
    students: [],
    occupiedSlots: [],
    loading: true,
    filteredStudents: [],
  });

  const workingHours = [
    // Horários convertidos para UTC (Brasília: UTC-3)
    { start: 9, end: 15 }, // 06:00-12:00 BRT → 09:00-15:00 UTC
    { start: 16, end: 25 }, // 13:00-22:00 BRT → 16:00-01:00 UTC
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [instructors, vehicles, students] = await Promise.all([
          axios.get(
            "https://sistemaautoescola.onrender.com/api/instrutores/getall",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get("https://sistemaautoescola.onrender.com/api/veiculos", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://sistemaautoescola.onrender.com/api/alunos", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setState((prev) => ({
          ...prev,
          instructors: instructors.data,
          vehicles: vehicles.data,
          students: students.data,
          filteredStudents: students.data,
          loading: false,
        }));
      } catch (error) {
        toast.error("Erro ao carregar dados iniciais");
        setState((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchOccupiedSlots = async () => {
      if (state.instructor) {
        try {
          const res = await axios.get(
            `https://sistemaautoescola.onrender.com/api/aula/instrutor/${state.instructor._id}`
          );

          // Converter datas para objetos Date UTC
          const aulasComDatasUTC = res.data.map((aula) => ({
            ...aula,
            data: new Date(aula.data), // Mantém o UTC original do banco
          }));

          setState((prev) => ({
            ...prev,
            occupiedSlots: aulasComDatasUTC,
          }));

          // console.log(
          //   "Horários ocupados (UTC):",
          //   aulasComDatasUTC.map((a) => a.data.toISOString())
          // );
        } catch (error) {
          toast.error("Erro ao buscar horários ocupados");
        }
      }
    };
    fetchOccupiedSlots();
  }, [state.instructor]);

  const generateAvailableHours = () => {
    if (!state.date || !state.instructor) return [];

    // console.log("\n--- GERANDO HORÁRIOS DISPONÍVEIS ---");

    // Converter data selecionada para UTC
    const selectedDateUTC = new Date(state.date + "T00:00:00Z");
    // console.log("Data selecionada (UTC):", selectedDateUTC.toISOString());

    // Filtrar aulas do mesmo dia em UTC
    const aulasNaData = state.occupiedSlots.filter((aula) => {
      const aulaDate = aula.data;
      return (
        aulaDate.getUTCFullYear() === selectedDateUTC.getUTCFullYear() &&
        aulaDate.getUTCMonth() === selectedDateUTC.getUTCMonth() &&
        aulaDate.getUTCDate() === selectedDateUTC.getUTCDate()
      );
    });

    // console.log(
    //   "Aulas no mesmo dia (UTC):",
    //   aulasNaData.map((a) => a.data.toISOString())
    // );

    // Converter agendamentos temporários para UTC
    const tempAppointmentsUTC = state.appointments
      .filter((appt) => appt.date === state.date)
      .flatMap((appt) => {
        const start = new Date(`${appt.date}T${appt.time}:00Z`);
        const slots = [];
        for (let i = 0; i < appt.duration / 50; i++) {
          slots.push(new Date(start.getTime() + i * 50 * 60000));
        }
        return slots;
      });

    // console.log(
    //   "Agendamentos temp (UTC):",
    //   tempAppointmentsUTC.map((d) => d.toISOString())
    // );

    // Juntar todos os horários ocupados
    const allOccupied = [
      ...aulasNaData.map((a) => a.data),
      ...tempAppointmentsUTC,
    ];

    // console.log(
    //   "Todos ocupados (UTC):",
    //   allOccupied.map((d) => d.toISOString())
    // );

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
        // Verificar ocupação em UTC
        const isOccupied = allOccupied.some(
          (ocupado) =>
            ocupado.getUTCHours() === current.getUTCHours() &&
            ocupado.getUTCMinutes() === current.getUTCMinutes()
        );

        if (!isOccupied) {
          // Converter para horário local apenas na exibição
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

  const addAppointment = () => {
    if (!state.date || !state.time) {
      toast.error("Selecione data e horário");
      return;
    }

    setState((prev) => ({
      ...prev,
      appointments: [
        ...prev.appointments,
        {
          date: prev.date,
          time: prev.time,
          duration: prev.duration, // Armazena a duração
        },
      ],
      date: "",
      time: "",
    }));
  };

  const removeAppointment = (index) => {
    setState((prev) => ({
      ...prev,
      appointments: prev.appointments.filter((_, i) => i !== index),
    }));
  };

  const saveAppointments = async () => {
    try {
      if (!state.instructor || !state.vehicle || !state.student) {
        toast.error("Selecione instrutor, veículo e aluno!");
        return;
      }

      const appointmentsToSend = state.appointments.map((appt) => ({
        instructor: state.instructor._id,
        student: state.student._id,
        veiculo: state.vehicle._id,
        datetime: new Date(`${appt.date}T${appt.time}:00`).toISOString(),
        tipo: state.duration === 50 ? "simples" : "dupla",
      }));
      // console.log(appointmentsToSend);
      const response = await axios.post(
        "https://sistemaautoescola.onrender.com/api/aula/multiple",
        appointmentsToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.errors?.length > 0) {
        response.data.errors.forEach((error) => {
          toast.error(`Erro na aula ${error.index + 1}: ${error.error}`);
        });
      }

      if (response.data.saved?.length > 0) {
        toast.success(
          `${response.data.saved.length} aulas salvas com sucesso!`
        );
        navigate("/aulas");
      }
    } catch (error) {
      console.error("Erro completo:", error);
      let errorMessage = "Erro desconhecido";

      if (error.response) {
        errorMessage = error.response.data.message || "Erro no servidor";
      } else if (error.request) {
        errorMessage = "Sem resposta do servidor - verifique sua conexão";
      } else {
        errorMessage = error.message;
      }

      toast.error(`Falha no agendamento: ${errorMessage}`);
    }
  };

  if (state.loading) return <Load_pages />;
  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day);
  };
  return (
    <div className="agendamento-container">
      <FullScreen />
      <h1>Novo Agendamento de Aulas</h1>
      <div className="section-one">
        <div className="selection-group">
          <div className="form-group">
            <label>Instrutor:</label>
            <Select
              options={state.instructors.map((instructor) => ({
                value: instructor._id,
                label: `${instructor.usuario} - ${instructor.email}`,
              }))}
              onChange={(selectedOption) =>
                setState((prev) => ({
                  ...prev,
                  instructor: state.instructors.find(
                    (i) => i._id === selectedOption.value
                  ),
                }))
              }
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#0a0a0a",
                  color: "#fff",
                  border: "1px solid #fff",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#fff",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#0a0a0a",
                  color: "#fff",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#333" : "#0a0a0a",
                  color: "#fff",
                }),
              }}
            />
          </div>

          <div className="form-group">
            <label>Veículo:</label>
            <Select
              options={state.vehicles.map((v) => ({
                value: v._id,
                label: `${v.placa} - ${v.marca} ${v.modelo}`,
              }))}
              onChange={(selected) =>
                setState((prev) => ({
                  ...prev,
                  vehicle: state.vehicles.find((v) => v._id === selected.value),
                }))
              }
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#0a0a0a",
                  color: "#fff",
                  border: "1px solid #fff",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#fff",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#0a0a0a",
                  color: "#fff",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#333" : "#0a0a0a",
                  color: "#fff",
                }),
              }}
            />
          </div>
        </div>

        <div className="lesson-config">
          <div className="form-group">
            <label>Tipo de Aula:</label>
            <select
              value={state.duration}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  duration: Number(e.target.value),
                }))
              }
            >
              <option value={50}>Aula Simples (50min)</option>
              <option value={100}>Aula Dupla (100min)</option>
            </select>
          </div>
          <div className="datetime-picker">
            <div className="form-group">
              <label>Data:</label>
              <input
                type="date"
                value={state.date}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    date: e.target.value,
                    time: "",
                  }))
                }
              />
            </div>

            <div className="form-group">
              <label>Horário:</label>
              <select
                value={state.time}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, time: e.target.value }))
                }
                disabled={!state.date}
              >
                <option value="">Selecione o Horário</option>
                {generateAvailableHours().map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>
          </div>{" "}
          <button
            className="add-button"
            onClick={addAppointment}
            disabled={!state.date || !state.time}
          >
            Adicionar Horário
          </button>
        </div>
      </div>

      <div className="section-one">
        <div className="appointments-list">
          <h3>Horários Selecionados:</h3>
          {state.appointments.length === 0 ? (
            <p>Nenhum horário adicionado</p>
          ) : (
            <ul className="appointments-grid">
              {state.appointments.map((appt, index) => (
                <li key={index}>
                  {parseLocalDate(appt.date).toLocaleDateString("pt-BR")} -{" "}
                  {appt.time}
                  <button
                    className="remove-button"
                    onClick={() => removeAppointment(index)}
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="student-selection">
          <div className="form-group">
            <label>Aluno:</label>
            <input
              type="text"
              placeholder="Pesquisar aluno..."
              className="InputAlunoAge"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filtered = state.students.filter((student) =>
                  student.nome.toLowerCase().includes(searchTerm)
                );
                setState((prev) => ({ ...prev, filteredStudents: filtered }));
              }}
            />
            <div className="student-results">
              {state.filteredStudents?.map((student) => (
                <div
                  key={student._id}
                  className="student-option"
                  onClick={() => setState((prev) => ({ ...prev, student }))}
                >
                  {student.nome}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="actions">
        <button className="cancel-button" onClick={() => navigate("/aulas")}>
          Cancelar
        </button>
        <button
          className="save-button"
          onClick={saveAppointments}
          disabled={!state.student || state.appointments.length === 0}
        >
          Salvar Agendamentos
        </button>
      </div>
    </div>
  );
};

export default Agendamento;
