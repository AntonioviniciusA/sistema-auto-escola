import React from "react";
import { useNavigate } from "react-router-dom";
import "./ErrorPage.css";

function ErrorPage() {
  const navigate = useNavigate();

  const handleUnauthorized = () => {
    localStorage.clear(); // Clear local storage
    navigate('/login'); // Redirect to login page
  };

  const handleBack = () => {
    navigate("/"); // Altere o "/" para a página inicial ou a página desejada
  };

  return (
    <div className="error-page">
      <h1>404 - Página Não Encontrada</h1>
      <p>Desculpe, a página que você está procurando não existe.</p>
      <button onClick={handleBack}>Voltar para o Sistema</button>
    </div>
  );
}

export default ErrorPage;
