import React from "react";
import axios from "axios";
import "./ModalConcluirAula.css";

const ModalConcluirAula = ({ isOpen, onClose, onConfirm, aulaSelecionada }) => {
  if (!isOpen || !aulaSelecionada) return null;

  const handleConfirm = async () => {
    try {
      await axios.put(
        `https://sistemaautoescola.onrender.com/api/aula/status/${aulaSelecionada._id}`,
        {
          status: "Concluída",
        }
      );
      onConfirm(); // Atualiza a lista de aulas
      onClose();
    } catch (error) {
      console.error("Erro ao concluir aula:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmar Conclusão</h2>
        <p>
          Deseja concluir a aula de {aulaSelecionada.alunoNome} com{" "}
          {aulaSelecionada.instrutorNome}?
        </p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-confirm" onClick={handleConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConcluirAula;
