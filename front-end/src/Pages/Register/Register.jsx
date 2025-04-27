import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaClipboardList } from "react-icons/fa";
import "./Register.css";
import Load_pages from "../../Components/Load_pages";
import { ToastContainer, toast } from "react-toastify";
import FullScreen from "../../Components/FullScreenButton/FullScreenButton.jsx";
import "react-toastify/dist/ReactToastify.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    usuario: "",
    email: "",
    password: "",
    levelAuth: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(true);

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.usuario.trim()) {
      tempErrors.usuario = "Nome de usuário é obrigatório";
      toast.error("Nome de usuário é obrigatório");
      isValid = false;
    }
    if (!formData.email.trim()) {
      tempErrors.email = "Email é obrigatório";
      toast.error("Email é obrigatório");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email inválido";
      toast.error("Email inválido");
      isValid = false;
    }
    if (!formData.password.trim()) {
      tempErrors.password = "Senha é obrigatória";
      toast.error("Senha é obrigatória");
      isValid = false;
    }
    if (!formData.levelAuth.trim()) {
      tempErrors.levelAuth = "Nível de autorização é obrigatório";
      toast.error("Nível de autorização é obrigatório");
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  useEffect(() => {
    setTimeout(() => {
      setIsRefreshing(false);
    }, 300);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const userResponse = await axios.post(
        "https://sistemaautoescola.onrender.com/api/user",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Usuário registrado com sucesso!");

      navigate("/Alunos");
    } catch (error) {
      toast.error("Erro ao registrar:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isRefreshing) {
    return <Load_pages />;
  }

  return (
    <>
      <FullScreen />

      <div className="container">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="container-register">
          <div className="left-register">
            <div className="ctn-messages">
              <h1>Bem Vindo!</h1>
              <p>
                Registre uma conta para ter acesso a todos os recursos do nosso
                sistema
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form-register">
            <header className="header-title">
              <h1 className="title">Registrar uma Conta</h1>
            </header>

            <div className="container-inputs">
              <div className="input-container">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="usuario"
                  placeholder="Nome de Usuário"
                  value={formData.usuario}
                  onChange={handleChange}
                  className={errors.usuario ? "is-invalid" : ""}
                />
              </div>

              <div className="input-container">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "is-invalid" : ""}
                />
              </div>

              <div className="input-container">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="input-container">
                <FaClipboardList className="input-icon" />
                <select
                  id="LevelAuth"
                  name="levelAuth"
                  value={formData.levelAuth}
                  onChange={handleChange}
                >
                  <option value="">Escolha o nível de autorização</option>
                  <option value="Dev">Dev</option>
                  <option value="Administrador">Administrador</option>
                  <option value="instrutor">Instrutor</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="btn-register">
                {loading ? "Carregando..." : "Registrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
