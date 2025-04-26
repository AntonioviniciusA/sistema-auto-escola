import { useState } from "react";
import {
  FaCalendarAlt,
  FaBell,
  FaUserPlus,
  FaSignOutAlt,
  FaArrowLeft,
  FaArrowRight,
  FaRegistered,
} from "react-icons/fa"; // Importando os ícones da react-icons
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import "./Sidebar.css";
import logo from "../assets/logo.png";

const SidebarPc = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar se o usuário está logado
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn); // Alterna o estado de login/logout
    localStorage.clear(); // Limpa o localStorage
    window.location.reload();
    navigate("/");
  };

  const handleRegister = () => {
    // Função para redirecionar para a página de cadastro
    navigate("/register");
  };

  const menuItems = [
    // {
    //   icon: <FaHome className="icon" size={20} />,
    //   label: "Dashboard",
    //   path: "/Dashboard",
    // },

    {
      icon: <FaUserPlus className="icon" size={20} />,
      label: "Cadastro Aluno",
      path: "/Alunos",
    },
    // {
    //   icon: <FaBookOpen className="icon" size={20} />,
    //   label: "Aulas",
    //   path: "/aulas",
    // },
    {
      icon: <FaCalendarAlt className="icon" size={20} />,
      label: "Aulas",
      path: "/aulas",
    },
    {
      icon: <FaBell className="icon" size={20} />,
      label: "Notificações",
      path: "/Notificacao",
    },
    // {
    //   icon: <FaChartBar className="icon" size={20} />,
    //   label: "Relatórios",
    //   path: "/relatorios",
    // },
    // {
    //   icon: <FaBell className="icon" size={20} />,
    //   label: "Notificações",
    //   path: "/notificacoes",
    // },
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className={`sidebar-container ${isOpen ? "open" : "closed"}`}>
        {/* Logo */}
        <div className="logo-container">
          {isOpen ? (
            <h1>AutoLearn</h1>
          ) : (
            <div className="logo-placeholder">
              <img src={logo} alt="" />
            </div>
          )}
        </div>

        <Button className="auth-button" onClick={toggleSidebar}>
          {isOpen ? (
            <FaArrowLeft className="icon" size={20} />
          ) : (
            <FaArrowRight className="icon" size={20} />
          )}
        </Button>

        <div className="flex-1 w-full flex flex-col items-center space-y-4">
          {menuItems.map((item, index) => (
            <Link to={item.path} key={index} className="menu-item">
              {item.icon}
              {isOpen && <span className="menu-item-label">{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* Botão de Logout */}
        <div className="auth-buttons">
          <Button className="auth-button" onClick={handleLoginLogout}>
            {isOpen ? "Logout" : <FaSignOutAlt size={20} />}
          </Button>
        </div>
        <div className="auth-buttons">
          <Button className="auth-button" onClick={handleRegister}>
            {isOpen ? "Register" : <FaRegistered size={20} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarPc;
