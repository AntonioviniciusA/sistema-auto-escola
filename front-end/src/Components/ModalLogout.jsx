import React from "react";
import user from "../assets/usuario.webp";
import "./ModalLogout.css";
const ModalLogout = ({ isOpen, onClose }) => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-logout">
      <div className="modal-container-logout">
        <div className="modal-header-logout">
          <div className="user-profile-logout">
            <img
              src={user}
              loading="lazy"
              alt="Avatar do usuário"
              className="user-avatar-logout"
            />
            <div className="user-info-logout">
              <h3 className="user-name-logout">Vini do 0800</h3>
              <span className="user-email-logout">
                antoniovinicius_@outlook.com
              </span>
            </div>
          </div>
        </div>
        <div className="modal-content-logout">
          <h2>Deseja sair</h2>
          <p>Você tem certeza de que deseja sair da sua conta?</p>
          <div className="modal-buttons-logout">
            <button className="cancel-button-logout" onClick={onClose}>
              Cancelar
            </button>
            <button className="logout-button-logout" onClick={handleLogout}>
              Sim, sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLogout;
