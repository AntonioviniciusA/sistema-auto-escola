import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FaCheck, FaTimes} from "react-icons/fa";
import "./Notificacao.css";

function Notificacao() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Atualização do Sistema",
      message:
        "Nova versão do sistema está disponível. Atualize para acessar os novos recursos.",
      type: "info",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
    },
    {
      id: "2",
      title: "Backup Realizado",
      message: "Backup automático do sistema foi concluído com sucesso.",
      type: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: true,
    },
    {
      id: "3",
      title: "Erro de Conexão",
      message: "Houve um problema na conexão com o servidor. Tente novamente.",
      type: "error",
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      read: false,
    },
  ]);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="w-5 h-5 text-green-500"
          />
        );
      case "error":
        return (
          <FontAwesomeIcon
            icon={faExclamationCircle}
            className="w-5 h-5 text-red-500"
          />
        );
      default:
        return (
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="w-5 h-5 text-blue-500"
          />
        );
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);

    if (minutes < 60) {
      return `${minutes} minutos atrás`;
    } else if (minutes < 1440) {
      return `${Math.floor(minutes / 60)} horas atrás`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const filteredNotifications = notifications.filter((notification) => {
    const typeFilterPassed = (() => {
      switch (activeFilter) {
        case "warnings":
          return notification.type === "error";
        case "notifications":
          return (
            notification.type === "info" || notification.type === "success"
          );
        case "recent":
          const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return notification.timestamp > twentyFourHoursAgo;
        default:
          return true;
      }
    })();

    const readFilterPassed = (() => {
      switch (readFilter) {
        case "read":
          return notification.read;
        case "unread":
          return !notification.read;
        default:
          return true;
      }
    })();

    return typeFilterPassed && readFilterPassed;
  });

  const getUnreadCount = () => notifications.filter((n) => !n.read).length;

  return (
    <div className="">
    <div className="HeaderNotification">
      <h1>Notificações</h1>
        <div className="notification">
          <h4>Quantidade de Notificação</h4>
          {getUnreadCount() > 0 && (
            <span className="NotificationCount">{getUnreadCount()}</span>
          )}
        </div>

        {/* Filter Header */}
        <div className="ctn-buttons">
            <button onClick={() => setActiveFilter("all")} className="">
              Todos
            </button>
            <button onClick={() => setActiveFilter("warnings")} className="">
              Avisos
            </button>
            <button
              onClick={() => setActiveFilter("notifications")}
              className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
                activeFilter === "notifications"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >Notificações
            </button>
            <button onClick={() => setActiveFilter("recent")} className="">
              Recentes
            </button>

            <button onClick={() => setReadFilter("unread")} className="">
              Não lidas
            </button>
            <button onClick={() => setReadFilter("read")} className="">
              Lidas
            </button>
        </div>

        <div className="">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className="">
              <div className="notification-card">
                <div className="notification-content">
                  {getIcon(notification.type)}
                  <div>
                    <h3 className="">{notification.title}</h3>
                    <p className="">{notification.message}</p>
                    <span className="">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="notification-buttons">
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="btn-deleted"
                  >
                    <FaTimes className="icon" size={15} />
                  </button>

                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="btn-mark-read"
                    >
                    <FaCheck className="icon" size={15} />
                    </button>
                  )}
                  
                </div>
              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faBell} className="" />
              <h3 className="">
                {activeFilter === "all"
                  ? "Nenhuma notificação"
                  : activeFilter === "warnings"
                  ? "Nenhum aviso"
                  : activeFilter === "notifications"
                  ? "Nenhuma notificação"
                  : "Nenhuma notificação recente"}
                {readFilter !== "all" &&
                  ` ${readFilter === "read" ? "lida" : "não lida"}`}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notificacao;
