import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import Load_pages from "../../Components/Load_pages";
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/Alunos");
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 300);
  }, [navigate]);

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
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  if (isRefreshing) {
    return <Load_pages />;
  }

  return (
    <div className="container ">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <Load_pages />}

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

          <button
            className={`btn-login ${loading ? "loading" : ""}`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Login"}
          </button>
        </form>
        <div className="rightlogin">
          <svg
            width="100%"
            id="svg"
            viewBox="0 0 1440 590"
            xmlns="http://www.w3.org/2000/svg"
            className="transition duration-300 ease-in-out delay-150"
          >
            <defs>
              <linearGradient id="gradient" x1="77%" y1="8%" x2="23%" y2="92%">
                <stop offset="5%" stopColor="#fcb900"></stop>
                <stop offset="95%" stopColor="#fcb900"></stop>
              </linearGradient>
            </defs>
            <path
              d="M 0,600 L 0,300 C 91.36842105263153,275.42583732057415 182.73684210526307,250.85167464114832 267,250 C 351.26315789473693,249.14832535885168 428.4210526315791,272.01913875598086 534,263 C 639.5789473684209,253.9808612440191 773.578947368421,213.0717703349282 870,167 C 966.421052631579,120.92822966507178 1025.2631578947369,69.69377990430623 1114,41 C 1202.7368421052631,12.306220095693778 1321.3684210526317,6.153110047846889 1440,0 L 1440,600 L 0,600 Z"
              stroke="none"
              strokeWidth="0"
              fill="url(#gradient)"
              fillOpacity="0.53"
              className="transition-all duration-300 ease-in-out delay-150 path-0"
            ></path>
            <path
              d="M 0,600 L 0,500 C 119.78947368421055,478.81339712918657 239.5789473684211,457.6267942583732 322,431 C 404.4210526315789,404.3732057416268 449.47368421052636,372.3062200956938 552,361 C 654.5263157894736,349.6937799043062 814.5263157894736,359.14832535885176 917,350 C 1019.4736842105264,340.85167464114824 1064.421052631579,313.1004784688995 1142,285 C 1219.578947368421,256.8995215311005 1329.7894736842104,228.44976076555025 1440,200 L 1440,600 L 0,600 Z"
              stroke="none"
              strokeWidth="0"
              fill="url(#gradient)"
              fillOpacity="1"
              className="transition-all duration-300 ease-in-out delay-150 path-1"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Login;
