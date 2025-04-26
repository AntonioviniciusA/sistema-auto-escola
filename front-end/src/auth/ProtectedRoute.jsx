import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./useAuth";
import LoadingPage from "../Components/Loading";

const ProtectedRoute = ({ requiredRole }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const levelAuth = localStorage.getItem("levelAuth");
  useEffect(() => {
    // Simula um atraso na verificação da autenticação
    const checkAuth = async () => {
      // A autenticação está sendo verificada aqui
      setLoading(false);
    };

    checkAuth();
  }, []); // O useEffect é executado uma vez quando o componente é montado

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && levelAuth !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
