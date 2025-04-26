import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarPc from "./Components/SidebarPc.jsx";
import SidebarMob from "./Components/SidebarMob.jsx";
import Login from "./Pages/Login.jsx";
import Agendamento from "./Pages/Agendamento.jsx";
import Aulas from "./Pages/Aulas.jsx";
import Detalhes from "./Pages/Detalhes.jsx";
import Aluno from "./Pages/Aluno.jsx";
import Notificacao from "./Pages/Notificacao.jsx";
import CadastroAluno from "./Pages/CadastroAluno.jsx";
import "./styles.css";
import RegisterForm from "./Pages/Register.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Unauthorized from "./auth/Unauthorized.jsx";
import EditarAluno from "./Pages/AlunoEdit.jsx";

const App = () => {
  return (
    <Router>
      <div className="container">
        {/* Sidebar para desktop */}
        <div className="sidebar-pc">
          <SidebarPc />
        </div>

        {/* Sidebar para dispositivos móveis */}
        <div className="sidebar-mob">
          <SidebarMob />
        </div>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Rota protegida para usuários autenticados */}
            <Route element={<ProtectedRoute />}>
              <Route path="/Alunos" element={<Aluno />} />
              <Route path="/Cadastrar-aluno" element={<CadastroAluno />} />
              <Route path="/Aulas" element={<Aulas />} />
              <Route path="/Agendamento" element={<Agendamento />} />
              <Route path="/Notificacao" element={<Notificacao />} />
              <Route path="/Detalhes/:id" element={<Detalhes />} />

              {/* Teste de Página Aluno Edit*/}
              <Route path="/editar-aluno/:id" element={<EditarAluno />} />
            </Route>

            {/* Rota protegida apenas para ADMIN */}
            <Route element={<ProtectedRoute requiredRole="Dev" />}>
              <Route path="/Register" element={<RegisterForm />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
