import { useState } from "react";
import "./DeleteStudentModal.css";

export default function DeleteStudentModal({ isOpen, onClose, onDelete, studentName }) {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleDelete = () => {
    if (password.trim()) {
      onDelete(password);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Excluir Aluno</h2>
        <p>Tem certeza que deseja excluir o aluno <strong>{studentName}</strong>?</p>
        <input 
          type="password" 
          placeholder="Digite sua senha para confirmar" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>Cancelar</button>
          <button className="delete-button" onClick={handleDelete} disabled={!password.trim()}>Excluir</button>
        </div>
      </div>
    </div>
  );
}