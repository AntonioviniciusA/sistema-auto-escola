import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./useAuth";
import LoadingPage from "../Components/Loading";

const ProtectedRoute = ({ requiredRole }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const levelAuth = localStorage.getItem("levelAuth");

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Verificar se 'requiredRole' é um array e se o 'levelAuth' está na lista de papéis
  const hasRequiredRole = Array.isArray(requiredRole)
    ? requiredRole.includes(levelAuth)
    : levelAuth === requiredRole;

  if (requiredRole && !hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
