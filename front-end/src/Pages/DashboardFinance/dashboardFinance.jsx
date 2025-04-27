import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTimesCircle,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import FullScreen from "../../Components/FullScreenButton/FullScreenButton.jsx";
import "./DashboardFinance.css";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
} from "@mui/material";
import Load_pages from "../../Components/Load_pages";
ChartJS.register(...registerables);

const DashboardFinance = () => {
  const [pagamentosVencidos, setPagamentosVencidos] = useState([]);
  const [pagamentosPagos, setPagamentosPagos] = useState([]);
  const [pagamentosPendentes, setPagamentosPendentes] = useState([]);
  const [totais, setTotais] = useState({ vencidos: 0, pagos: 0, pendentes: 0 });
  const [error, setError] = useState(null);
  const [animatedVencidos, setAnimatedVencidos] = useState(0);
  const [animatedPagos, setAnimatedPagos] = useState(0);
  const [animatedPendentes, setAnimatedPendentes] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const hoje = new Date();

  const formatarData = (dataString) => {
    if (!dataString) return "";
    const [dia, mes, ano] = dataString.split("/");
    return `${dia}/${mes}/${ano}`;
  };

  // Função para animar os números
  const animateNumber = (targetValue, setterFunction) => {
    let startValue = 0;
    const increment = targetValue / 100;
    const interval = setInterval(() => {
      startValue += increment;
      if (startValue >= targetValue) {
        clearInterval(interval);
        setterFunction(targetValue);
      } else {
        setterFunction(Math.floor(startValue));
      }
    }, 10); // Atualiza a cada 10ms
  };

  const atualizarPagamentosVencidos = async (pendentes) => {
    const pendentesVencidos = pendentes.filter(
      (pagamento) => pagamento.status === "Pendente"
    );
    if (pendentesVencidos.length > 0) {
      try {
        await Promise.all(
          pendentesVencidos.map((pagamento) =>
            axios.put(
              `https://sistemaautoescola.onrender.com{pagamento.id}`,
              {
                ...pagamento,
                status: "Vencido",
              }
            )
          )
        );
        buscarPagamentos();
      } catch (erro) {
        console.error("Erro ao atualizar pagamentos vencidos:", erro);
      }
    }
  };

  const atualizarParaPago = async (id) => {
    try {
      await axios.put(
        `https://sistemaautoescola.onrender.com/api/pagamentos/${id}`,
        {
          status: "Pago",
          dataPagamento: hoje.toISOString().split("T")[0],
        }
      );
      buscarPagamentos();
    } catch (erro) {
      console.error("Erro ao atualizar para pago:", erro);
    }
  };

  const buscarPagamentos = async () => {
    try {
      const resposta = await axios.get(
        "https://sistemaautoescola.onrender.com/api/pagamentos"
      );
      const pagamentos = resposta.data;

      const pagos = pagamentos.filter(
        (pagamento) => pagamento.status === "Pago"
      );

      const pendentes = pagamentos.filter(
        (pagamento) => pagamento.status === "Pendente"
      );

      const vencidos = pagamentos.filter((pagamento) => {
        if (!pagamento.dataVencimento) return false;
        const [dia, mes, ano] = pagamento.dataVencimento.split("/");
        const dataVencimento = new Date(`${ano}-${mes}-${dia}`);
        return (
          pagamento.status === "Vencido" ||
          (pagamento.status === "Pendente" &&
            dataVencimento <= new Date(hoje.setHours(0, 0, 0, 0)))
        );
      });

      setPagamentosPagos(pagos);
      setPagamentosPendentes(pendentes);
      setPagamentosVencidos(vencidos);

      setTotais({
        vencidos: vencidos.reduce((soma, p) => soma + (p.valor || 0), 0),
        pagos: pagos.reduce((soma, p) => soma + (p.valor || 0), 0),
        pendentes: pendentes.reduce((soma, p) => soma + (p.valor || 0), 0),
      });

      // Animação dos números
      animateNumber(
        vencidos.reduce((soma, p) => soma + (p.valor || 0), 0),
        setAnimatedVencidos
      );
      animateNumber(
        pagos.reduce((soma, p) => soma + (p.valor || 0), 0),
        setAnimatedPagos
      );
      animateNumber(
        pendentes.reduce((soma, p) => soma + (p.valor || 0), 0),
        setAnimatedPendentes
      );

      atualizarPagamentosVencidos(vencidos);
    } catch (erro) {
      console.error("Erro ao buscar os dados de pagamento:", erro);
    }
  };

  useEffect(() => {
    buscarPagamentos();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 300);
  }, []);

  // Preparar dados para gráficos
  const prepareStatusChartData = {
    labels: ["Vencidos", "Pagos", "Pendentes"],
    datasets: [
      {
        data: [
          pagamentosVencidos.length,
          pagamentosPagos.length,
          pagamentosPendentes.length,
        ],
        backgroundColor: [
          "rgba(255, 0, 0, 0.7)", // Vermelho vibrante
          "rgba(0, 255, 255, 0.7)", // Ciano vibrante
          "rgba(255, 238, 0, 0.8)", // Verde vibrante
        ],
        borderColor: [
          "rgba(255, 0, 0, 1)", // Vermelho vibrante (borda)
          "rgba(0, 255, 255, 1)", // Ciano vibrante (borda)
          "rgba(255, 238, 0, 1)", // Verde vibrante (borda)
        ],
        borderWidth: 1,
      },
    ],
  };

  const prepareValueChartData = {
    labels: ["Vencidos", "Pagos", "Pendentes"],
    datasets: [
      {
        label: "Valores (R$)",
        data: [totais.vencidos, totais.pagos, totais.pendentes],
        backgroundColor: "rgba(0, 123, 255, 0.7)", // Azul mais vibrante
        borderColor: "rgba(0, 123, 255, 1)", // Azul mais intenso (borda)
        borderWidth: 2,
      },
    ],
  };

  // Novo gráfico de evolução mensal
  const prepareMonthlyChartData = () => {
    const meses = Array.from({ length: 12 }, (_, i) => {
      return new Date(hoje.getFullYear(), i, 1).toLocaleString("default", {
        month: "short",
      });
    });

    const valoresPorMes = Array(12).fill(0);

    [...pagamentosPagos, ...pagamentosVencidos, ...pagamentosPendentes].forEach(
      (pagamento) => {
        if (pagamento.dataVencimento) {
          const [dia, mes, ano] = pagamento.dataVencimento.split("/");
          const mesIndex = parseInt(mes) - 1;
          if (mesIndex >= 0 && mesIndex < 12) {
            valoresPorMes[mesIndex] += pagamento.valor || 0;
          }
        }
      }
    );

    return {
      labels: meses,
      datasets: [
        {
          label: "Valor por Mês (R$)",
          data: valoresPorMes,
          backgroundColor: "rgba(138, 43, 226, 0.7)", // Roxo vibrante (orchid)
          borderColor: "rgba(138, 43, 226, 1)", // Roxo intenso (orchid) para borda
          borderWidth: 2,
        },
      ],
    };
  };

  if (isRefreshing) {
    return <Load_pages />;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={buscarPagamentos}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="dashboard-financeiro">
      <div className="dashboard-header">
        {" "}
        <FullScreen />
        <h1>Painel Financeiro</h1>
      </div>
      {/* Seção superior com 3 cards de status */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card vencidos">
            <div className="stat-header">
              <div>
                <h3>Pagamentos Vencidos</h3>
                <p className="stat-value">R$ {animatedVencidos.toFixed(2)}</p>
                <p className="stat-count">{pagamentosVencidos.length} itens</p>
              </div>
              <FaTimesCircle className="stat-icon" />
            </div>
          </div>

          <div className="stat-card pagos">
            <div className="stat-header">
              <div>
                <h3>Pagamentos Pagos</h3>
                <p className="stat-value">R$ {animatedPagos.toFixed(2)}</p>
                <p className="stat-count">{pagamentosPagos.length} itens</p>
              </div>
              <FaCheckCircle className="stat-icon" />
            </div>
          </div>

          <div className="stat-card pendentes">
            <div className="stat-header">
              <div>
                <h3>Pagamentos Pendentes</h3>
                <p className="stat-value">R$ {animatedPendentes.toFixed(2)}</p>
                <p className="stat-count">{pagamentosPendentes.length} itens</p>
              </div>
              <FaClock className="stat-icon" />
            </div>
          </div>
        </div>
        {/* Seção inferior com 3 gráficos */}
        <div className="charts-container">
          <div className="chart-card">
            <h3>Quantidade por Status</h3>
            <div className="pie-chart-card">
              <Pie
                data={prepareStatusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        padding: 0,
                        boxWidth: 10,
                        font: {
                          size: 10,
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="chart-card">
            <h3>Valores por Status (R$)</h3>
            <Bar
              data={prepareValueChartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `R$ ${value}`,
                    },
                  },
                },
              }}
            />
          </div>

          <div className="chart-card">
            <h3>Evolução Mensal (R$)</h3>
            <Line
              data={prepareMonthlyChartData()}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `R$ ${value}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </section>

      {/* Seção de pagamentos vencidos */}
      <section className="payments-section">
        <h2>Pagamentos Vencidos</h2>
        <div className="payments-grid">
          {pagamentosVencidos.length > 0 ? (
            <Grid container spacing={2}>
              {pagamentosVencidos.map((pagamento) => (
                <Grid item xs={12} sm={6} md={4} key={pagamento.id}>
                  <Card
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                      border: "1px solid white",
                      "&:hover": {
                        border: "1px solid var(--details)",
                      },
                    }}
                  >
                    <CardContent>
                      <Box mb={2}>
                        <Typography variant="h6">
                          {pagamento.AlunoNome || "Aluno não informado"}
                        </Typography>
                        <span
                          className={`status-badge ${
                            pagamento.status === "Vencido"
                              ? "vencido"
                              : "pendente"
                          }`}
                        >
                          {pagamento.status}
                        </span>
                      </Box>

                      <Box mb={2}>
                        <div className="detail-row">
                          <Typography variant="body2">Valor:</Typography>
                          <Typography variant="body2">
                            R$ {pagamento.valor?.toFixed(2) || "0,00"}
                          </Typography>
                        </div>
                        <div className="detail-row">
                          <Typography variant="body2">Vencimento:</Typography>
                          <Typography variant="body2">
                            {formatarData(pagamento.dataVencimento)}
                          </Typography>
                        </div>
                        <div className="detail-row">
                          <Typography variant="body2">Método:</Typography>
                          <Typography variant="body2">
                            {pagamento.tipoPagamento || "Não informado"}
                          </Typography>
                        </div>
                      </Box>

                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => atualizarParaPago(pagamento.id)}
                        fullWidth
                        sx={{
                          border: "1px solid white",
                          color: "white",
                          backgroundColor: "transparent",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 255, 0.1)",
                            border: "1px solid var(--details)",
                          },
                          "&.Mui-focused": {
                            borderColor: "blue",
                            boxShadow: "0 0 0 2px rgba(0, 0, 255, 0.3)",
                          },
                        }}
                      >
                        Marcar como Pago
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              className="ctn-pay"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box className="not-pay" display="flex" alignItems="center">
                <FaExclamationTriangle size={20} className="piscar" />
                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                  Nenhum pagamento vencido encontrado!
                </Typography>
              </Box>
            </Box>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardFinance;
