import React from "react";
import { Link } from "react-router-dom";
import "./unauth.css";

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h1>403 - Acesso Negado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
      <Link to="/">Voltar para a página inicial</Link>
    </div>
  );
};

export default Unauthorized;
