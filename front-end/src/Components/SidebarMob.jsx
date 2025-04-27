import { useState } from "react";
import {
  FaCalendarAlt,
  FaBell,
  FaUserPlus,
  FaCoins,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import "./SidebarMob.css";
import ModalLogout from "../Components/ModalLogout";

const SidebarMob = () => {
  const [modalAberto, setModalAberto] = useState(false);
  const navigate = useNavigate();

  const handleLogoutConfirm = () => {
    localStorage.clear();
    window.location.reload();
    navigate("/");
  };

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const menuItemsmob = [
    { icon: <FaUserPlus size={20} />, path: "/Alunos" },
    { icon: <FaCalendarAlt size={20} />, path: "/aulas" },
    { icon: <FaCoins size={20} />, path: "/dashboard-financeiro"},
    // { icon: <FaBell size={20} />, path: "/Notificacao" },
  ];

  return (
    <div className="sidebarMob" id="no-print">
      <div className="sidebar-container">
        <div className="menu-items-container">
          {menuItemsmob.map((item, index) => (
            <Link to={item.path} key={index} className="menu-item">
              {item.icon}
            </Link>
          ))}
        </div>
      </div>

     
    </div>
  );
};

export default SidebarMob;
