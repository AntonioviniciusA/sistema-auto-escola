import { useState, useRef, useEffect } from "react";
import {
  FaBars,
  FaUserPlus,
  FaCalendarAlt,
  FaCar,
  FaCoins,
  FaBell,
  FaSignOutAlt,
  FaRegistered,
  FaTimes,
  FaPaperPlane,
} from "react-icons/fa";
import { ShieldUser } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import "./ToggleMenu.css";
import logo from "../assets/logo.png";
import Modal from "../Components/ModalLogout";

const ToggleMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null); // Referência para a sidebar

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
      icon: <FaUserPlus size={20} />,
      label: "Cadastro Aluno",
      path: "/Alunos",
    },
    { icon: <FaCalendarAlt size={20} />, label: "Aulas", path: "/aulas" },
    { icon: <FaCar size={20} />, label: "Carros Aula", path: "/DrivingSchool" },
    {
      icon: <FaCoins size={20} />,
      label: "Dashboard Financeiro",
      path: "/dashboard-financeiro",
    },
    // { icon: <FaBell size={20} />, label: "Notificações", path: "/Notificacao" },
  ];

  // Função para fechar o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Adiciona o event listener ao montar o componente
    document.addEventListener("mousedown", handleClickOutside);

    // Remove o event listener ao desmontar o componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      <div
        ref={sidebarRef} // Atribui a referência para a sidebar
        className={`sidebar-small ${isOpen ? "open" : "closed"}`}
      >
        <div className="sidebar-header">
          <img src={logo} loading="lazy" alt="Logo" className="sidebar-logo" />
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item, index) => (
            <Link to={item.path} key={index} className="menu-item">
              {item.icon}
              <span className="menu-item-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Button className="auth-button" onClick={abrirModal}>
            <FaSignOutAlt size={20} />
          </Button>
          <Button className="auth-button" onClick={handleRegister}>
            <FaRegistered size={20} />
          </Button>
          <Button className="auth-button" onClick={handleDevPage}>
            {isOpen ? "Central ADM" : <ShieldUser size={20} />}
          </Button>
        </div>
      </div>
      <Modal isOpen={modalAberto} onClose={fecharModal} />
    </>
  );
};

export default ToggleMenu;
