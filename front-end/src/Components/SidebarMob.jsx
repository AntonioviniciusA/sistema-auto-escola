import { useState } from "react";
import {
  FaCalendarAlt,
  FaBell,
  FaUserPlus,
  FaSignOutAlt,
  FaRegistered,
} from "react-icons/fa"; // Importando os ícones da react-icons
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import "./SidebarMob.css";

const SidebarMob = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar se o usuário está logado
  const navigate = useNavigate();

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn); // Alterna o estado de login/logout
    localStorage.clear(); // Limpa o localStorage
    window.location.reload();
    navigate("/");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const menuItems = [
    {
      icon: <FaUserPlus className="icon" size={60} />,
      label: "Cadastro Aluno",
      path: "/Alunos",
    },
    {
      icon: <FaCalendarAlt className="icon" size={60} />,
      label: "Aula",
      path: "/aulas",
    },
    {
      icon: <FaBell className="icon" size={60} />,
      label: "Notificações",
      path: "/Notificacao",
    },
  ];

  return (
    <div className="sidebarMob">
      <div className="sidebar-container">
        {/* Logo */}

        <div className="menu-items-container">
          {menuItems.map((item, index) => (
            <Link to={item.path} key={index} className="menu-item">
              {item.icon}
            </Link>
          ))}
        </div>

        {/* Botões de Login/Logout */}
        <div className="auth-buttons">
          <Button className="auth-button" onClick={handleLoginLogout}>
            <FaSignOutAlt size={60} />
          </Button>

          {/* Botão de Registro */}

          <Button className="auth-button" onClick={handleRegister}>
            <FaRegistered size={60} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarMob;
