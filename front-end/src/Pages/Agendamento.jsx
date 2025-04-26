import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../Components/Search";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Agendamentos.css";

const Agendamento = () => {
  const navigate = useNavigate();
  const [newAppointment, setNewAppointment] = useState({
    instructor: "",
    date: "",
    time: "",
    duration: 50,
    student: "", // Alterado para armazenar um objeto completo
  });
  const [studentName, setStudentName] = useState("");
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [instructorSuggestions, setInstructorSuggestions] = useState([]);
  const [step, setStep] = useState(1);

  const buscarDados = async () => {
    try {
      const studentResponse = await axios.get(
        "https://sistemaautoescola.onrender.com/api/alunos"
      );
      setStudentSuggestions(studentResponse.data);
    } catch (error) {
      toast.error("Erro ao Buscar Alunos.");
      return;
    }

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
      return;
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  const handleInstructorSelect = (selectedInstructor) => {
    console.log("Instrutor selecionado:", selectedInstructor);
    if (selectedInstructor) {
      setNewAppointment((prev) => ({
        ...prev,
        instructor: {
          _id: selectedInstructor._id,
          usuario: selectedInstructor.usuario,
          email: selectedInstructor.email,
        },
      }));
    } else {
      toast.error("Instrutor Não Encontrado.");
    }
  };

  const addStudent = (student) => {
    setNewAppointment((prev) => ({
      ...prev,
      student: {
        _id: student._id,
      },
    }));
  };

  const saveAppointment = async () => {
    if (
      !newAppointment.instructor ||
      !newAppointment.date ||
      !newAppointment.time
    ) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    // Unindo data e hora em um único campo
    const datetime = `${newAppointment.date}T${newAppointment.time}:00.000Z`;

    const appointmentData = {
      instructor: newAppointment.instructor._id,
      datetime, // Envia a data e horário unidos
      duration: newAppointment.duration,
      student: newAppointment.student._id,
    };

    console.log("Dados a serem enviados:", appointmentData);

    try {
      const response = await fetch("https://sistemaautoescola.onrender.com/api/aula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) throw new Error("Bad Request");

      const data = await response.json();
      console.log("Aula salva com sucesso:", data);
      navigate("/aulas");
    } catch (error) {
      toast.error("Erro ao Salvar Aula.");
      return;
    }
  };

  const handleNextStep = () => {
    if (
      step === 1 &&
      (!newAppointment.instructor ||
        !newAppointment.date ||
        !newAppointment.time)
    ) {
      toast.error("Todos os campos são obrigatórios.");
      return;
    }
    setStep(step + 1);
  };

  const handlePreviousStep = () => setStep(step - 1);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container-geral">
        {step === 1 && (
          <div className="container-age">
            <h1 className="titletop">Nova Aula</h1>
            <br />
            <select
              className="select-age"
              id="input-fc"
              onChange={(e) => {
                const selectedInstructor = instructorSuggestions.find(
                  (instrutor) => instrutor._id === e.target.value
                );
                handleInstructorSelect(selectedInstructor);
              }}
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

            <h2 className="title-age">Data:</h2>
            <input
              className="input-data-aluno"
              id="input-fc"
              type="date"
              value={newAppointment.date}
              onChange={(e) =>
                setNewAppointment((prev) => ({ ...prev, date: e.target.value }))
              }
            />
            <h2 className="title-age">Horario:</h2>
            <input
              className="input-hr-aluno"
              id="input-fc"
              type="time"
              value={newAppointment.time}
              onChange={(e) =>
                setNewAppointment((prev) => ({ ...prev, time: e.target.value }))
              }
            />
            <h2 className="title-age">Tipo de Aula:</h2>
            <select
              className="select-age"
              id="input-fc"
              value={newAppointment.duration}
              onChange={(e) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  duration: e.target.value,
                }))
              }
            >
              <option value={50}>Simples (50 min)</option>
              <option value={100}>Dupla (100 min)</option>
            </select>
            <br />
            <button onClick={handleNextStep}>Avançar</button>
          </div>
        )}

        {step === 2 && (
          <div className="container-age">
            <h1 className="titletop">Adicionar Aluno</h1>
            <Search
              type="text"
              placeholder="Pesquisar Aluno"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <br />
            <ul>
              {studentName &&
                studentSuggestions
                  .filter((student) =>
                    student.nome
                      .toLowerCase()
                      .includes(studentName.toLowerCase())
                  )
                  .map((student) => (
                    <li key={student._id}>
                      {student.nome}{" "}
                      <button onClick={() => addStudent(student)}>
                        Adicionar
                      </button>
                    </li>
                  ))}
            </ul>
            <ul>
              {newAppointment.student && <li>{newAppointment.student.nome}</li>}
            </ul>
            <div className="container-button">
              <button onClick={handlePreviousStep}>Voltar</button>
              <button onClick={saveAppointment}>Finalizar</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Agendamento;
