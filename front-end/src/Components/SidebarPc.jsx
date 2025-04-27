import { useState } from "react";
import {
  FaCalendarAlt,
  FaBell,
  FaUserPlus,
  FaSignOutAlt,
  FaArrowLeft,
  FaArrowRight,
  FaRegistered,
  FaCar,
  FaCoins,
  FaPaperPlane,
} from "react-icons/fa";
import { ShieldUser } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import "./Sidebar.css";
import logo from "../assets/logo.png";
import Modal from "../Components/ModalLogout";

const SidebarPc = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleDevPage = () => {
    navigate("/DevPage");
  };

  const menuItems = [
    {
      icon: <FaUserPlus className="icon" size={20} />,
      label: "Cadastro Aluno",
      path: "/Alunos",
    },
    {
      icon: <FaCalendarAlt className="icon" size={20} />,
      label: "Aulas",
      path: "/aulas",
    },
    {
      icon: <FaCar className="icon" size={20} />,
      label: "Carros Aula",
      path: "/DrivingSchool",
    },
    {
      icon: <FaCoins className="icon" size={20} />,
      label: "Dashboard Financeiro",
      path: "/dashboard-financeiro",
    },
    // {
    //   icon: <FaBell className="icon" size={20} />,
    //   label: "Notificações",
    //   path: "/Notificacao",
    // },
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`} id="no-print">
      <div className={`sidebar-container ${isOpen ? "open" : "closed"}`}>
        {/* Logo */}

        <div className="logo-container">
          {isOpen ? (
            <div className="headerside">
              <div className="container-logo-pc">
                <div className="logo-placeholderpc">
                  <img loading="lazy" src={logo} alt="" />
                </div>
                <h1>AutoLearn</h1>
              </div>
            </div>
          ) : (
            <div className="logo-placeholder">
              <img loading="lazy" src={logo} alt="" />
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

        <div className="bodyside">
          <div className="flex-1 w-full flex flex-col items-center space-y-4">
            {menuItems.map((item, index) => (
              <Link to={item.path} key={index} className="menu-item">
                {item.icon}
                {isOpen && (
                  <span className="menu-item-label">{item.label}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
        {/* Botão de Logout */}
        <div className="footerside">
          <div className="auth-buttons">
            <Button className="auth-button" onClick={abrirModal}>
              {isOpen ? "Logout" : <FaSignOutAlt size={20} />}
            </Button>
          </div>

          <div className="auth-buttons">
            <Button className="auth-button" onClick={handleRegister}>
              {isOpen ? "Register" : <FaRegistered size={20} />}
            </Button>
          </div>
          <div className="auth-buttons">
            <Button className="auth-button" onClick={handleDevPage}>
              {isOpen ? "Central ADM" : <ShieldUser size={20} />}
            </Button>
          </div>
        </div>
        {/* Modal de Logout */}
        <Modal isOpen={modalAberto} onClose={fecharModal} />
      </div>
    </div>
  );
};

export default SidebarPc;
