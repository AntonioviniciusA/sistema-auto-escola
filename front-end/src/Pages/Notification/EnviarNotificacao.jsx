import { useEffect, useState } from "react";
import "./notificationStyles.css";

export default function NotificationApp() {
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState("system");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const storedNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
  }, []);

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

      setMessage("");
      setTitle("");
    }
  };

  return (
    <div className="notification-container">
      <h2>Enviar Notificação</h2>

      <input
        type="text"
        placeholder="Título da notificação..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="notification-input"
      />

      <textarea
        placeholder="Digite a mensagem da notificação..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="notification-textarea"
      ></textarea>

      <select
        value={notificationType}
        onChange={(e) => setNotificationType(e.target.value)}
        className="notification-select"
      >
        <option value="system">Sistema</option>
        <option value="alert">Alerta</option>
        <option value="info">Informação</option>
      </select>

      <button onClick={sendNotification} className="notification-btn">
        Enviar
      </button>
    </div>
  );
}
