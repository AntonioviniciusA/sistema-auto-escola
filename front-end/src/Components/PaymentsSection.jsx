import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentsSection.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Plus, Printer, Download } from "lucide-react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
    backgroundColor: "#f0f0f0",
    fontWeight: 'bold',
    textAlign: 'center'
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
    textAlign: 'center'
  },
  statusPago: {
    color: 'green',
    fontWeight: 'bold'
  },
  statusPendente: {
    color: 'orange',
    fontWeight: 'bold'
  },
  statusVencido: {
    color: 'red',
    fontWeight: 'bold'
  }
});

const PaymentsPDF = ({ payments, filter }) => {
  const filteredPayments = payments.filter((payment) => {
    if (filter === "todos") return true;
    return payment.status && payment.status.toLowerCase() === filter;
  });

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>RELATÓRIO DE PAGAMENTOS</Text>
        <Text style={[styles.header, { fontSize: 12, fontWeight: 'normal' }]}>
          Filtro: {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </Text>
        
        <View style={styles.table}>
          {/* Cabeçalho */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text>Vencimento</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Valor</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Status</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Data Pagamento</Text>
            </View>
          </View>
          
          {/* Linhas */}
          {filteredPayments.map((payment, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text>
                  {payment.dataVencimento
                    ? new Date(payment.dataVencimento.split("/").reverse().join("-"))
                        .toLocaleDateString("pt-BR")
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text>R$ {payment.valor ? payment.valor.toFixed(2).replace(".", ",") : "0,00"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={
                  payment.status.toLowerCase() === "pago" ? styles.statusPago :
                  payment.status.toLowerCase() === "pendente" ? styles.statusPendente :
                  styles.statusVencido
                }>
                  {payment.status}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text>
                  {payment.dataPagamento 
                    ? new Date(payment.dataPagamento).toLocaleDateString("pt-BR") 
                    : "N/A"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};



function Payments({ id }) {
  const navigate = useNavigate();
  const [paymentFilter, setPaymentFilter] = useState("todos");
  const [payments, setPayments] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPaymentId, setMenuPaymentId] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [aluno, setAluno] = useState(null);


  const hoje = new Date();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar pagamentos do aluno
        const responsePayments = await axios.get(
          `https://sistemaautoescola.onrender.com/api/pagamentos/aluno/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPayments(responsePayments.data);

       // Buscar dados do aluno
       const responseAluno = await axios.get(
       `https://sistemaautoescola.onrender.com/api/alunos/${id}`,
         {
            headers: {
           Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
           }
         );
        setAluno(responseAluno.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, [id]);


  const filteredPayments = payments.filter((payment) => {
    if (paymentFilter === "todos") return true;
    return payment.status && payment.status.toLowerCase() === paymentFilter;
  });

  const atualizarParaPago = async (id) => {
    try {
      await axios.put(`https://sistemaautoescola.onrender.com/api/pagamentos/${id}`, {
        status: "Pago",
        dataPagamento: hoje.toISOString().split("T")[0],
      });
      window.location.reload();
    } catch (erro) {
      console.error("Erro ao atualizar para pago:", erro);
    }
  };

  const deletarPagamento = async (idPagamento) => {
    const confirmar = window.confirm("Tem certeza que deseja apagar este pagamento?");
    if (!confirmar) return;

    try {
      await axios.delete(`https://sistemaautoescola.onrender.com/api/pagamentos/${idPagamento}`);
      setPayments((prev) => prev.filter((p) => p._id !== idPagamento));
    } catch (error) {
      console.error("Erro ao deletar pagamento:", error);
    }
  };

  const handlePrint = () => {
    // Criar um elemento div para o conteúdo de impressão
    const printContent = document.createElement('div');
    
    // Formatar os dados para impressão
    const formattedPayments = filteredPayments.map(payment => ({
      vencimento: payment.dataVencimento
        ? new Date(payment.dataVencimento.split("/").reverse().join("-")).toLocaleDateString("pt-BR")
        : "N/A",
      valor: `R$ ${payment.valor ? payment.valor.toFixed(2).replace(".", ",") : "0,00"}`,
      status: payment.status,
      dataPagamento: payment.dataPagamento
        ? new Date(payment.dataPagamento).toLocaleDateString("pt-BR")
        : "N/A"
    }));
  
    // Adicionar o conteúdo HTML ao elemento div
    printContent.innerHTML = `
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          color: #000;
        }
        h1 { 
          text-align: center; 
          margin-bottom: 5px; 
          font-size: 18px;
          color:black;
        }
        .filter-info { 
          text-align: center; 
          margin-bottom: 15px;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 12px;
        }
        th, td {
          border: 1px solid #000;
          padding: 5px;
          text-align: center;
        }
        th {
          background-color: #f0f0f0;
          font-weight: bold;
        }
        .pago {
          color: green;
          font-weight: bold;
        }
        .pendente {
          color: orange;
          font-weight: bold;
        }
        .vencido {
          color: red;
          font-weight: bold;
        }
              .aluno-info {
            text-align: left;
            margin-bottom: 15px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          }
          .aluno-info p {
            margin: 5px 0;
          }
        @page {
          size: A4;
          margin: 10mm;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          #print-section, #print-section * {
            visibility: visible;
          }
          #print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      </style>
      <div id="print-section">
        <h1>RELATÓRIO DE PAGAMENTOS</h1>
         <div class="aluno-info">
            <p><strong>Aluno:</strong> ${aluno?.nome  || 'Não informado'}</p>
            <p><strong>Data de Nascimento:</strong> ${aluno?.dataNascimento ? new Date(aluno.dataNascimento).toLocaleDateString("pt-BR") : 'Não informado'}</p>
            <p><strong>Cpf:</strong> ${aluno?.cpf || 'Não informado'}</p>
            <p><strong>Contato:</strong> ${aluno?.telefone || 'Não informado'}</p>
          </div>
        <table>
          <thead>
            <tr>
              <th>Vencimento</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Data Pagamento</th>
            </tr>
          </thead>
          <tbody>
            ${formattedPayments.map(payment => `
              <tr>
                <td>${payment.vencimento}</td>
                <td>${payment.valor}</td>
                <td class="${payment.status.toLowerCase()}">${payment.status}</td>
                <td>${payment.dataPagamento}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  
    // Adicionar o conteúdo ao body
    document.body.appendChild(printContent);
  
    // Esperar um momento para garantir que o conteúdo foi renderizado
    setTimeout(() => {
      window.print();
      
      // Remover o conteúdo após a impressão
      document.body.removeChild(printContent);
    }, 200);
  };
  
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuPaymentId(id);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPaymentId(null);
  };
  return (
    <div className="container-bg-pay">
      {showPdfViewer ? (
        <div className="pdf-viewer">
          <PaymentsPDF payments={payments} filter={paymentFilter} />
        </div>
      ) : (
        <>
          <div className="header-text-btn">
            <div className="payment-filters" id="no-print">
              {["todos", "pendente", "pago", "vencido"].map((filtro) => (
                <button
                  key={filtro}
                  className={`filter-button ${filtro} ${paymentFilter === filtro ? "active" : ""}`}
                  onClick={() => setPaymentFilter(filtro)}
                >
                  {filtro.charAt(0).toUpperCase() + filtro.slice(1)}
                </button>
              ))}
            </div>

            <div className="ctn-btns-pay">
              <button
                onClick={() => navigate(`/gerenciador-de-pagamento/${id}`)}
                className="btn-pay"
                id="no-print"
              >
                <Plus size={18} className="icon-pay" /> Gerenciar Pagamentos
              </button>
              <button onClick={handlePrint} className="btn-print-pay" id="no-print">
                <Printer size={18} /> Imprimir
              </button>
            </div>
          </div>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vencimento</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments.map((payment, index) => (
                  <TableRow key={payment._id || index}>
                    <TableCell>
                      {payment.dataVencimento
                        ? new Date(
                            payment.dataVencimento.split("/").reverse().join("-")
                          ).toLocaleDateString("pt-BR")
                        : "Data inválida"}
                    </TableCell>
                    <TableCell>
                      R$ {payment.valor ? payment.valor.toFixed(2) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <span className={`status ${payment.status}`}>
                        {payment.status.toLowerCase() === "pago"
                          ? "Pago"
                          : payment.status.toLowerCase() === "vencido"
                          ? "Vencido"
                          : "Pendente"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, payment._id)}
                        sx={{ color: "white" }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={menuPaymentId === payment._id}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        {payment.status.toLowerCase() !== "pago" && (
                          <MenuItem
                            onClick={() => {
                              atualizarParaPago(payment._id);
                              handleMenuClose();
                            }}
                          >
                            Marcar como Pago
                          </MenuItem>
                        )}
                        <MenuItem
                          onClick={() => {
                            deletarPagamento(payment._id);
                            handleMenuClose();
                          }}
                        >
                          Apagar
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
}

export default Payments;