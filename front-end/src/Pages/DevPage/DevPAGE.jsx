import React, { useEffect, useState } from "react";
import {
  Terminal,
  Shield,
  Activity,
  Database,
  AlertTriangle,
  Send,
  Lock,
  Unlock,
  HardDrive,
  Cpu,
  Server,
} from "lucide-react";
import axios from "axios";
import debounce from "lodash.debounce";
import FullScreen from "../../Components/FullScreenButton/FullScreenButton.jsx";
import "./DevPage.css";

const DevPAGE = () => {
  // Estados corrigidos para estrutura de dados esperada
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [performanceData, setPerformanceData] = useState([]);
  const [storageInfo, setStorageInfo] = useState(null);
  const [systemLocked, setSystemLocked] = useState(false);
  const [lockMessage, setLockMessage] = useState("");
  const [systemStats, setSystemStats] = useState({
    cpu: { usage: 0 },
    memory: { usage: 0 },
    uptime: 0,
  });
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState("system");
  const [title, setTitle] = useState("");
  const [socket, setSocket] = useState(null);
  const [selectedAlunoId, setSelectedAlunoId] = useState("");

  // Verificar nível de autenticação
  const userLevel = localStorage.getItem("levelAuth");
  const isDev = userLevel === "Dev";

  // Verificar status do sistema
  useEffect(() => {
    checkSystemStatus();
    fetchSystemStats();
    const interval = setInterval(fetchSystemStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkSystemStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sistemaautoescola.onrender.com/api/system/status",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSystemLocked(response.data.isLocked);
      setLockMessage(response.data.message || "");
    } catch (error) {
      console.error("Erro ao verificar status do sistema:", error);
      if (error.response?.status === 403) {
        window.location.href = "/login";
      }
    }
  };

  const fetchSystemStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://sistemaautoescola.onrender.com/api/system/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Garantir a estrutura correta dos dados
      setSystemStats({
        cpu: response.data.cpu || { usage: 0 },
        memory: response.data.memory || { usage: 0 },
        uptime: response.data.uptime || 0,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas do sistema:", error);
      if (error.response?.status === 403) {
        window.location.href = "/login";
      }
    }
  };

  const toggleSystemLock = async () => {
    try {
      const response = await axios.post(
        "https://sistemaautoescola.onrender.com/api/system/toggle-lock",
        {
          message: systemLocked ? "Sistema liberado" : "Sistema em manutenção",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSystemLocked(response.data.isLocked);
      setLockMessage(response.data.message);
    } catch (error) {
      console.error("Erro ao alternar bloqueio do sistema:", error);
    }
  };

  // Buscar usuários
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://sistemaautoescola.onrender.com/api/user/getall"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  // Debounced fetch para armazenamento
  const debouncedFetchStorage = debounce(async () => {
    try {
      const response = await axios.get(
        "https://sistemaautoescola.onrender.com/api/performance/checkStorage"
      );
      setStorageInfo(response.data);
    } catch (error) {
      console.error("Erro ao buscar armazenamento:", error);
    }
  }, 1000);

  // Buscar dados de performance
  useEffect(() => {
    fetchPerformanceData();
    debouncedFetchStorage();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const response = await axios.get(
        "https://sistemaautoescola.onrender.com/api/performance/checkPerformance",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPerformanceData(response.data);
    } catch (error) {
      console.error("Erro ao buscar performance:", error);
    }
  };

  const sendNotification = () => {
    if (message.trim() !== "" && title.trim() !== "") {
      const notification = {
        id: Date.now(),
        type: notificationType,
        title: title,
        message: message,
        timestamp: new Date().toISOString(),
        read: false,
      };

      socket.send(JSON.stringify(notification));
      setMessage("");
      setTitle("");
    }
  };

  const changePassword = async () => {
    try {
      await axios.put(
        `https://sistemaautoescola.onrender.com/api/user/change-password/${selectedUserId}`,
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Senha alterada com sucesso!");
      setNewPassword("");
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      alert("Erro ao alterar senha");
    }
  };

  const deleteUser = async () => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await axios.delete(
          `https://sistemaautoescola.onrender.com/api/user/${selectedUserId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("Usuário excluído com sucesso!");
        fetchUsers();
        setSelectedUserId("");
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Erro ao excluir usuário");
      }
    }
  };
  const deleteAluno = async (selectedAlunoId) => {
    if (window.confirm("Tem certeza que deseja excluir este Aluno?")) {
      try {
        console.log(selectedAlunoId);
        await axios.delete(
          `https://sistemaautoescola.onrender.com/api/alunos/delete/${selectedAlunoId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("Aluno excluído com sucesso!");
        fetchPerformanceData();
      } catch (error) {
        console.error("Erro ao excluir Aluno:", error);
        alert("Erro ao excluir Aluno");
      }
    }
  };
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  return (
    <div className="admin-container">
      <h1 className="page-title">
        <FullScreen />
        <Terminal className="inline-block mr-2" /> DEV_CONTROL_PANEL
      </h1>

      {/* Sistema de bloqueio - visível apenas para Devs */}
      {isDev && (
        <div className="system-lock-section">
          <h2 className="flex items-center gap-2">
            {systemLocked ? (
              <Lock className="text-red-500" />
            ) : (
              <Unlock className="text-green-500" />
            )}
            SYSTEM STATUS: {systemLocked ? "LOCKED" : "UNLOCKED"}
          </h2>
          {systemLocked && <p className="lock-message">{lockMessage}</p>}
          <button
            onClick={toggleSystemLock}
            className={`btn ${systemLocked ? "btn-success" : "btn-danger"}`}
          >
            {systemLocked ? "UNLOCK SYSTEM" : "LOCK SYSTEM"}
          </button>
        </div>
      )}

      {/* Mensagem de bloqueio para não-Devs */}
      {systemLocked && !isDev && (
        <div className="system-locked-overlay">
          <div className="locked-message-box">
            <Lock size={48} className="mb-4" />
            <h2>SYSTEM UNDER MAINTENANCE</h2>
            <p>{lockMessage}</p>
          </div>
        </div>
      )}

      {/* Dashboard principal (oculto quando bloqueado para não-Devs) */}
      {(!systemLocked || isDev) && (
        <div className="dashboard-grid">
          {/* Seção de status do sistema */}
          <div className="system-controls">
            <div className="card storage-card">
              <h2 className="card-title">
                <Database className="inline-block" /> SYSTEM_STORAGE
              </h2>
              {storageInfo ? (
                <>
                  <p>STATUS: {storageInfo.message}</p>
                  <p>USAGE: {storageInfo.storageUsedMB}MB / 500MB</p>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(storageInfo.storageUsedMB / 500) * 100}%`,
                      }}
                    ></div>
                  </div>
                </>
              ) : (
                <p className="loading-text">Carregando...</p>
              )}
            </div>

            <div className="card stats-card">
              <h2 className="card-title">
                <Cpu className="inline-block" /> SYSTEM_STATS
              </h2>
              <div className="stat-item">
                <HardDrive className="stat-icon" />
                <span>CPU: {systemStats.cpu.usage}%</span>
                <div className="stat-bar">
                  <div
                    className="stat-bar-fill"
                    style={{ width: `${systemStats.cpu.usage}%` }}
                  ></div>
                </div>
              </div>
              <div className="stat-item">
                <Server className="stat-icon" />
                <span>MEM: {systemStats.memory.usage}%</span>
                <div className="stat-bar">
                  <div
                    className="stat-bar-fill"
                    style={{ width: `${systemStats.memory.usage}%` }}
                  ></div>
                </div>
              </div>
              <div className="stat-item">
                <Activity className="stat-icon" />
                <span>UPTIME: {formatUptime(systemStats.uptime)}</span>
              </div>
            </div>
          </div>

          {/* Seção de controle de acesso */}
          <div className="system-controls">
            <div className="card access-card">
              <h2 className="card-title">
                <Shield className="inline-block" /> ACCESS_CONTROL
              </h2>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="select-input"
              >
                <option value="">SELECT_USER</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.usuario} ({user.levelauth})
                  </option>
                ))}
              </select>
              <input
                type="password"
                placeholder="NEW_PASSWORD"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="password-inputdev"
              />
              <div className="button-group">
                <button
                  onClick={changePassword}
                  className="btn btn-primary"
                  disabled={!selectedUserId}
                >
                  CHANGE_PASSWORD
                </button>
                <button
                  onClick={deleteUser}
                  className="btn btn-danger"
                  disabled={!selectedUserId}
                >
                  DELETE_USER
                </button>
              </div>
            </div>

            <div className="card access-card">
              <h2 className="card-title">
                <Send className="inline-block" /> SEND_NOTIFICATION
              </h2>
              <input
                type="text"
                placeholder="TITLE"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="notification-input"
              />
              <textarea
                placeholder="MESSAGE"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="notification-textarea"
              ></textarea>
              <select
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value)}
                className="select-input"
              >
                <option value="system">SYSTEM</option>
                <option value="alert">ALERT</option>
                <option value="info">INFO</option>
              </select>
              <button
                onClick={sendNotification}
                className="btn btn-primary"
                disabled={!message || !title}
              >
                SEND
              </button>
            </div>
          </div>

          {/* Seção de performance */}
          <div className="card performance-card">
            <h2 className="card-title">
              <Activity className="inline-block" /> PERFORMANCE_MATRIX
            </h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>USER_ID</th>
                    <th>PROGRESS</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.length > 0 ? (
                    performanceData.map((student) => (
                      <tr key={student.alunoId}>
                        <td>{student.alunoNome}</td>
                        <td>{student.completedClasses}</td>
                        <td>
                          <span className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {student.message}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              deleteAluno(student.alunoId);
                            }}
                          >
                            REMOVE
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="loading-text">
                        Carregando...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevPAGE;
