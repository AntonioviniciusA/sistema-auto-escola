import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faTriangleExclamation,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import FullScreen from "../../Components/FullScreenButton/FullScreenButton.jsx";
import "./Notifications.css";

// Função para obter a data e hora atuais no formato YYYY-MM-DD HH:MM
const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// Função para obter data/hora com valores específicos (mantendo o dia atual)
const getTodayDateTime = (hours, minutes) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${day}/${month}/${year} ${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;
};

const initialNotifications = [
  {
    id: 1,
    type: "system",
    title: "Atualização do sistema",
    message:
      "Uma nova atualização do sistema está disponível. Reinicie seu dispositivo.",
    timestamp: getTodayDateTime(10, 30), // Hoje às 10:30
    read: false,
  },
  {
    id: 2,
    type: "alert",
    title: "Alerta de Segurança",
    message:
      "Tentativa de login incomum detectada a partir de um novo dispositivo.",
    timestamp: getTodayDateTime(9, 15), // Hoje às 09:15
    read: true,
  },
  {
    id: 3,
    type: "info",
    title: "Novo Recurso",
    message: "Confira os novos recursos do nosso painel!",
    timestamp: getTodayDateTime(16, 45), // Hoje às 16:45
    read: false,
  },
  {
    id: 4,
    type: "system",
    title: "Aviso de manutenção",
    message: "Manutenção programada para amanhã.",
    timestamp: getTodayDateTime(14, 20), // Hoje às 14:20
    read: true,
  },
  {
    id: 5,
    type: "alert",
    title: "Expiração de senha",
    message: "Sua senha expirará em 3 dias.",
    timestamp: getTodayDateTime(11, 10), // Hoje às 11:10
    read: false,
  },
];

function NotificationSection({
  title,
  icon,
  notifications,
  filter,
  onFilterChange,
  onMarkAsRead,
}) {
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "read") return notification.read;
    if (filter === "unread") return !notification.read;
    return true;
  });

  return (
    <div className="notification-section">
      <div className="section-header">
        {/*NÃO VEJO NECESSIDADE DE REPETIR O TITULO
        <div className="section-title">
          <FontAwesomeIcon icon={icon} size="lg" />
          <h2>{title}</h2>
        </div>
        */}
        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => onFilterChange("all")}
          >
            Todas
          </button>
          <button
            className={filter === "read" ? "active" : ""}
            onClick={() => onFilterChange("read")}
          >
            Lidas
          </button>
          <button
            className={filter === "unread" ? "active" : ""}
            onClick={() => onFilterChange("unread")}
          >
            Não lidas
          </button>
        </div>
      </div>
      <div className="notifications-list">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${
              notification.read ? "read" : "unread"
            }`}
            onClick={() => onMarkAsRead(notification.id)}
          >
            <div className="notification-content">
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <span className="timestamp">{notification.timestamp}</span>
            </div>
            {!notification.read && <div className="unread-indicator" />}
          </div>
        ))}
        {filteredNotifications.length === 0 && (
          <div className="no-notifications">
            Nenhuma notificação para exibir
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [systemFilter, setSystemFilter] = useState("all");
  const [alertFilter, setAlertFilter] = useState("all");
  const [infoFilter, setInfoFilter] = useState("all");
  const [activeSection, setActiveSection] = useState("system");

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const getUnreadCount = (type) => {
    return notifications.filter((n) => n.type === type && !n.read).length;
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "system":
        return (
          <NotificationSection
            title="Notificações do Sistema"
            icon={faBell}
            notifications={notifications.filter((n) => n.type === "system")}
            filter={systemFilter}
            onFilterChange={setSystemFilter}
            onMarkAsRead={handleMarkAsRead}
          />
        );
      case "alert":
        return (
          <NotificationSection
            title="Alertas"
            icon={faTriangleExclamation}
            notifications={notifications.filter((n) => n.type === "alert")}
            filter={alertFilter}
            onFilterChange={setAlertFilter}
            onMarkAsRead={handleMarkAsRead}
          />
        );
      case "info":
        return (
          <NotificationSection
            title="Informações"
            icon={faCircleInfo}
            notifications={notifications.filter((n) => n.type === "info")}
            filter={infoFilter}
            onFilterChange={setInfoFilter}
            onMarkAsRead={handleMarkAsRead}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header>
        <FullScreen />
        <h1>Notificações</h1>
        <nav className="section-nav">
          <button
            className={`nav-button ${
              activeSection === "system" ? "active" : ""
            }`}
            onClick={() => setActiveSection("system")}
          >
            <FontAwesomeIcon icon={faBell} />
            <span>Sistema</span>
            {getUnreadCount("system") > 0 && (
              <span className="unread-count">{getUnreadCount("system")}</span>
            )}
          </button>
          <button
            className={`nav-button ${
              activeSection === "alert" ? "active" : ""
            }`}
            onClick={() => setActiveSection("alert")}
          >
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <span>Alertas</span>
            {getUnreadCount("alert") > 0 && (
              <span className="unread-count">{getUnreadCount("alert")}</span>
            )}
          </button>
          <button
            className={`nav-button ${activeSection === "info" ? "active" : ""}`}
            onClick={() => setActiveSection("info")}
          >
            <FontAwesomeIcon icon={faCircleInfo} />
            <span>Informações</span>
            {getUnreadCount("info") > 0 && (
              <span className="unread-count">{getUnreadCount("info")}</span>
            )}
          </button>
        </nav>
      </header>
      <main>{renderActiveSection()}</main>
    </div>
  );
}

export default App;
