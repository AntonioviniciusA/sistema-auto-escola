import React, { useState } from "react";
import axios from "axios";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

  const validate = () => {
    let tempErrors = {};
    if (!formData.usuario.trim())
      tempErrors.usuario = "Nome de usuário é obrigatório";
    if (!formData.email.trim()) {
      tempErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email inválido";
    }
    if (!formData.password.trim()) tempErrors.password = "Senha é obrigatória";
    if (!formData.levelAuth.trim()) {
      tempErrors.levelAuth = "Nível de autorização é obrigatório";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const data = {
      usuario: formData.usuario,
      email: formData.email,
      password: formData.password,
      levelAuth: formData.levelAuth,
    };

    try {
      // Envia os dados para o banco de dados do usuário
      const userResponse = await axios.post(
        "https://sistemaautoescola.onrender.com/api/user",
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Resposta do servidor de usuário:", userResponse.data);

      // Se o nível de autorização for "instrutor", envia os dados para o banco de dados de instrutor
      if (formData.levelAuth === "instrutor") {
        const instructorResponse = await axios.post(
          "https://sistemaautoescola.onrender.com/api/instructor", // Altere para o endpoint correto para instrutores
          data,
          { headers: { "Content-Type": "application/json" } }
        );
        console.log(
          "Resposta do servidor de instrutor:",
          instructorResponse.data
        );
        alert("Registro realizado com sucesso!");
        navigate("/"); // Redireciona para login após sucesso
      }
    } catch (error) {
      console.error(
        "Erro ao registrar:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-user-register">
      <form onSubmit={handleSubmit}>
        <button
          type="button"
          className="toggle-back"
          onClick={() => window.history.back()}
        >
          <FaAngleLeft />
        </button>

        <h2>Registrar</h2>

        {errors.usuario && <div className="text-danger">{errors.usuario}</div>}
        <input
          type="text"
          name="usuario"
          placeholder="Nome de Usuário"
          value={formData.usuario}
          onChange={handleChange}
          className={errors.usuario ? "is-invalid" : ""}
        />

        {errors.email && <div className="text-danger">{errors.email}</div>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "is-invalid" : ""}
        />

        {errors.password && (
          <div className="text-danger">{errors.password}</div>
        )}
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? "is-invalid" : ""}
        />

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

        <button type="submit" disabled={loading}>
          {loading ? "Carregando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
  {
    /* FAZER O LAYOUT DESSA PAGINA */
  }
};

export default RegisterForm;
