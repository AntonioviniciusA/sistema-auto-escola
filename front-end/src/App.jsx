import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SidebarPc from "./Components/SidebarPc.jsx";
import SidebarMob from "./Components/SidebarMob.jsx";
import Login from "./Pages/Login/Login.jsx";
import Landing from "./Pages/LandingPage/LandingPage.jsx";
import Agendamento from "./Pages/Agendamento/Agendamento.jsx";
import Aulas from "./Pages/Aula/Aulas.jsx";
import Detalhes from "./Pages/Detalhes/Detalhes.jsx";
import Aluno from "./Pages/Aluno/Aluno.jsx";
import Notificacao from "./Pages/Notification/Notification.jsx";
import CadastroAluno from "./Pages/CadastroAluno/CadastroAluno.jsx";
import "./styles.css";
import RegisterForm from "./Pages/Register/Register.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Unauthorized from "./auth/Unauthorized.jsx";
import EditarAluno from "./Pages/StudentOverview/StudentOverview.jsx";
import DrivingSchool from "./Pages/DrivingSchoolDashboard/DrivingSchoolDashboard.jsx";
import DrivingSchoolRegister from "./Pages/DrivingSchoolRegister/DrivingSchoolRegister.jsx";
import ManageExpenses from "./Pages/DrivingSchoolExpenses/ManageExpenses.jsx";
import ErrorPage from "./Pages/ErrorPage/ErrorPage.jsx"; // Importando a página de erro
import ManagePayments from "./Pages/ManagePayments/ManagePayments.jsx";
import DashboardFinance from "./Pages/DashboardFinance/dashboardFinance.jsx";
import DevPage from "./Pages/DevPage/DevPAGE.jsx";
import ToggleMenu from "./Components/ToggleMunuMobile.jsx";

// import checkPerformance from "../APIs/checkPerfomace.js";
const App = () => {
  const location = useLocation();
  // useEffect(() => {
  //   checkPerformance(); // Chama a função ao iniciar a aplicação
  // }, []);

  return (
    <div className="container">
      {location.pathname !== "/" && location.pathname !== "/login" && (
        <>
          {/* Sidebar para desktop */}
          <div className="sidebar-pc">
            <SidebarPc />
          </div>

          {/* Sidebar para dispositivos móveis */}
          <div className="sidebar-mob">
            <SidebarMob />
            <ToggleMenu />
          </div>
        </>
      )}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Rota para páginas não encontradas */}
          <Route path="*" element={<ErrorPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* Rota protegida para usuários autenticados */}
          <Route element={<ProtectedRoute />}>
            <Route path="/Alunos" element={<Aluno />} />
            <Route path="/Cadastrar-aluno" element={<CadastroAluno />} />
            <Route path="/Aulas" element={<Aulas />} />
            <Route path="/Agendamento" element={<Agendamento />} />
            <Route path="/Notificacao" element={<Notificacao />} />
            <Route path="/Detalhes/:id" element={<Detalhes />} />
            <Route path="/DrivingSchool" element={<DrivingSchool />} />
            <Route path="/editar-aluno/:id" element={<EditarAluno />} />
            <Route
              path="/gerenciador-de-pagamento/:id"
              element={<ManagePayments />}
            />
            <Route
              path="/dashboard-financeiro"
              element={<DashboardFinance />}
            />
          </Route>

          {/* Rota protegida apenas para ADMIN ou DEV */}
          <Route
            element={<ProtectedRoute requiredRole={["Administrador"]} />}
          >
            <Route path="/Register" element={<RegisterForm />} />
            <Route
              path="/Gerenciador-de-despesas"
              element={<ManageExpenses />}
            />
            <Route
              path="/Gerenciador-de-veiculos"
              element={<DrivingSchoolRegister />}
            />
          </Route>
          {/* Rota protegida apenas para DEV */}
          <Route element={<ProtectedRoute requiredRole={["Dev"]} />}>
            <Route path="/DEVPAGE" element={<DevPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
