import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import FullScreen from "../../Components/FullScreenButton/FullScreenButton.jsx";
import "./ManagePayments.css";
function ManagePayments() {
  const { id } = useParams();
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentType, setPaymentType] = useState("credit");
  const [installment, setInstallment] = useState(1);
  const [payments, setPayments] = useState([]);

  // Fetch existing payments for the student
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (!id) {
          console.error("ID is required to fetch payments");
          return;
        }
        const response = await axios.get(
          `https://sistemaautoescola.onrender.com/api/pagamentos/aluno/${id}`
        );

        setPayments(response.data); // A resposta já está em formato JSON
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    if (id) {
      fetchPayments();
    }
  }, [id]);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se o id está disponível antes de enviar a requisição
    if (!id) {
      console.error("ID is required to submit the payment");
      return;
    }

    const paymentsToCreate = [];
    for (let i = 0; i < installment; i++) {
      const paymentDueDate = new Date(dueDate);
      if (i === 0) {
        paymentDueDate.setDate(paymentDueDate.getDate() + 3); // First due date is 3 days after
      } else {
        paymentDueDate.setMonth(paymentDueDate.getMonth() + i); // Subsequent due dates are 30 days apart
      }
      paymentsToCreate.push({
        dataVencimento: paymentDueDate.toISOString().split("T")[0],
        dataPagamento: null, // No payment date until paid
        tipoPagamento: paymentType,
        valor: parseFloat(amount) / installment, // Divide amount by number of installments
        parcela: i + 1,
        aluno: id,
      });
    }

    try {
      // Usando axios para enviar a requisição POST
      const responses = await Promise.all(
        paymentsToCreate.map((payment) =>
          axios.post(
            `https://sistemaautoescola.onrender.com/api/pagamentos`,
            payment
          )
        )
      );

      // Atualiza o estado com as respostas bem-sucedidas
      const responsesData = responses.map((res) => res.data);

      setPayments((prevPayments) => [...prevPayments, ...responsesData]);

      // Reset form fields
      setAmount("");
      setDueDate("");
      setInstallment(1);
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  return (
    <div>
      <FullScreen />
      <h2>Gerenciar Pagamentos do Aluno</h2>

      <div className="manage-payments">
        <form onSubmit={handleSubmit} className="Manage-payments-form">
          <div>
            <label>Valor:</label>
            <br />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="ManageExpenses"
            />
          </div>
          <div>
            <label>Data de Vencimento:</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="ManageExpenses"
            />
          </div>
          <div>
            <label>Método de Pagamento:</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="credit">Cartão de Crédito</option>
              <option value="pix">PIX</option>
            </select>
          </div>
          <div>
            <label>Parcela:</label>
            <input
              type="number"
              value={installment}
              onChange={(e) => setInstallment(e.target.value)}
              required
              className="ManageExpenses"
            />
          </div>
          <button type="submit">Adicionar Pagamento</button>
        </form>

        <h3>Pagamentos Existentes</h3>
        <div className="payments-list">
          {payments.map((payment, index) => (
            <div
              key={payment.id || index}
              className={`payment-item ${payment.status}`}
            >
              <p>Aluno: {payment.aluno}</p>
              <p>Vencimento: {payment.dataVencimento}</p>
              <p>Valor: R$ {payment.valor.toFixed(2)}</p>
              <p>Status: {payment.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManagePayments;
