import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Todos os campos são obrigatórios.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("E-mail inválido.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://sistemaautoescola.onrender.com/api/user/login",
        formData
      );
      const { token, user } = response.data;

      localStorage.setItem("levelAuth", user.levelAuth);
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("user", user.usuario);

      toast.success("Login realizado com sucesso!");
      setTimeout(() => navigate("/Alunos"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao realizar login.");
    } finally {
      setTimeout(() =>{
        setLoading(false);
      }, 600);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/Alunos");
    }
  }, [navigate]);

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading &&(
        <div className="loading-container">
          <span className="loading"></span>
        </div>
      )}  
      <div className="container-login">
        <form onSubmit={handleLogin} className="form">
          <h2 className="title-login">Login</h2>
          <input
            className="register-email"
            id="input-fc"
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <br />
          <input
            className="register-password"
            id="input-fc"
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? "Carregando..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
