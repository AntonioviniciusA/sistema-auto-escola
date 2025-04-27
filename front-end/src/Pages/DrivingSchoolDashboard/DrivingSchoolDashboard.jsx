import React, { useState, useEffect, useCallback } from "react";
import {
  Car,
  TrendingUp,
  Plus,
  GaugeCircle,
  Wrench,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import "./DrivingSchoolDasboard.css";
import { useNavigate } from "react-router-dom";
import FullScreen from "../../Components/FullScreenButton/FullScreenButton.jsx";
import Load_pages from "../../Components/Load_pages";

ChartJS.register(...registerables);

const API_BASE_URL = "https://sistemaautoescola.onrender.com";

function getFuelLevelClass(level) {
  level = Number(level);
  if (level <= 20) return "fuel-level-low";
  if (level <= 40) return "fuel-level-medium";
  return "fuel-level-high";
}

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function DrivingSchoolDashboard() {
  const [stats, setStats] = useState([]);
  const [cars, setCars] = useState([]);
  const [chartsData, setChartsData] = useState({ mensal: [], diario: [] });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(true);

  const [animatedValues, setAnimatedValues] = useState({
    abastecimento: 0,
    manutencao: 0,
    revisao: 0,
  });

  const animateNumber = useCallback((targetValues) => {
    const duration = 1000;
    const steps = 60;
    const stepValues = {};
    const increment = {};

    Object.keys(targetValues).forEach((key) => {
      increment[key] = targetValues[key] / steps;
      stepValues[key] = 0;
    });

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      Object.keys(targetValues).forEach((key) => {
        stepValues[key] += increment[key];
      });

      setAnimatedValues((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(stepValues).map(([key, value]) => [
            key,
            Math.floor(value),
          ])
        ),
      }));

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedValues(targetValues);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, chartsResponse, carsResponse] = await Promise.all(
          [
            fetch(`${API_BASE_URL}/api/despesas`),
            fetch(`${API_BASE_URL}/api/despesas/graficos`),
            fetch(`${API_BASE_URL}/api/veiculos`),
          ]
        );

        if (!statsResponse.ok) throw new Error("Erro ao carregar estatísticas");
        if (!chartsResponse.ok) throw new Error("Erro ao carregar gráficos");
        if (!carsResponse.ok) throw new Error("Erro ao carregar veículos");

        const [statsData, chartsData, carsData] = await Promise.all([
          statsResponse.json(),
          chartsResponse.json(),
          carsResponse.json(),
        ]);
        // console.log(statsData);
        const processedStats = [
          {
            title: "Abastecimento",
            value: Number(statsData.totalValues?.abastecimento),
            quantity: statsData.despesas?.filter(
              (d) => d.tipo === "abastecimento" || d.abastecimento
            ).length,
            icon: GaugeCircle,
            color: "text-blue-500",
          },
          {
            title: "Manutenção",
            value: Number(statsData.totalValues?.manutencao),
            quantity: statsData.despesas?.filter((d) => d.tipo === "manutencao")
              .length,
            icon: Wrench,
            color: "text-purple-500",
          },
          {
            title: "Revisão",
            value: Number(statsData.totalValues?.revisao),
            quantity: statsData.despesas?.filter((d) => d.tipo === "revisao")
              .length,
            icon: AlertCircle,
            color: "text-orange-500",
          },
        ];

        setStats(processedStats);
        setChartsData(chartsData || { mensal: [], diario: [] });
        setCars(carsData || []);
        animateNumber({
          abastecimento: processedStats[0].value,
          manutencao: processedStats[1].value,
          revisao: processedStats[2].value,
        });
        // console.log(processedStats);
        // console.log(chartsData);
      } catch (err) {
        console.error("Erro detalhado:", err);
        setError(err.message);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
        }, 300);
      }
    };

    fetchData();
  }, [animateNumber]);

  const prepareBarChartData = () => {
    if (!chartsData?.mensal) return { labels: [], datasets: [] };

    return {
      labels: chartsData.mensal.map((item) => item.label),
      datasets: [
        {
          label: "Abastecimento",
          data: chartsData.mensal.map((item) => Number(item.abastecimento)),
          backgroundColor: "rgba(59, 130, 246, 0.7)",
        },
        {
          label: "Manutenção",
          data: chartsData.mensal.map((item) => Number(item.manutencao)),
          backgroundColor: "rgba(168, 85, 247, 0.7)",
        },
        {
          label: "Revisão",
          data: chartsData.mensal.map((item) => Number(item.revisao)),
          backgroundColor: "rgba(245, 158, 11, 0.7)",
        },
      ],
    };
  };

  const prepareLineChartData = useCallback(() => {
    if (!chartsData.diario || chartsData.diario.length === 0) {
      return { labels: [], datasets: [] };
    }

    const uniqueDates = [
      ...new Set(chartsData.diario.map((item) => item.date)),
    ];

    const getDataByType = (type) => {
      return uniqueDates.map((date) => {
        const items = chartsData.diario.filter(
          (item) => item.date === date && item.tipo === type
        );
        return items.reduce((sum, item) => sum + Number(item.valor), 0);
      });
    };

    return {
      labels: uniqueDates,
      datasets: [
        {
          label: "Abastecimento",
          data: getDataByType("abastecimento"),
          borderColor: "rgba(59, 130, 246, 1)",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.1,
          fill: true,
        },
        {
          label: "Manutenção",
          data: getDataByType("manutencao"),
          borderColor: "rgba(168, 85, 247, 1)",
          backgroundColor: "rgba(168, 85, 247, 0.2)",
          tension: 0.1,
          fill: true,
        },
        {
          label: "Revisão",
          data: getDataByType("revisao"),
          borderColor: "rgba(245, 158, 11, 1)",
          backgroundColor: "rgba(245, 158, 11, 0.2)",
          tension: 0.1,
          fill: true,
        },
      ],
    };
  }, [chartsData.diario]);

  if (isRefreshing) {
    return <Load_pages />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <FullScreen />
          <h1 className="dashboard-title">Gestão de Veículos</h1>
        </header>

        <section className="stats-section">
          <div className="stats-header">
            <div></div>
            <button
              className="add-expense-btn"
              onClick={() => navigate("/Gerenciador-de-despesas")}
            >
              <Plus size={20} />
              <span>Gerenciador de Despesas</span>
            </button>
          </div>

          <div className="stats-grid">
            {stats.map((stat, index) => {
              const valueKey = ["abastecimento", "manutencao", "revisao"][
                index
              ];
              return (
                <div key={index} className="stat-card">
                  <div className="stat-header">
                    <div>
                      <p className="stat-value">
                        {formatCurrency(animatedValues[valueKey])}
                      </p>
                      <p className="stat-label">{stat.title}</p>
                    </div>
                    <stat.icon className={stat.color} size={24} />
                  </div>
                  <div className="stat-footer">
                    <TrendingUp size={16} />
                    <span>{stat.quantity} registros</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="charts-container">
            <div className="chart-card">
              <h3>Despesas Mensais</h3>
              <div className="chart-wrapper">
                <Bar
                  data={prepareBarChartData()}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      tooltip: {
                        callbacks: {
                          label: (context) => formatCurrency(context.raw),
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => formatCurrency(value),
                        },
                        title: { display: true, text: "Valor" },
                      },
                      x: {
                        title: { display: true, text: "Mês/Ano" },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="chart-card">
              <h3>Evolução das Despesas</h3>
              <div className="chart-wrapper">
                <Line
                  data={prepareLineChartData()}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      tooltip: {
                        callbacks: {
                          label: (context) => formatCurrency(context.raw),
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => formatCurrency(value),
                        },
                        title: { display: true, text: "Valor" },
                      },
                      x: {
                        title: { display: true, text: "Data" },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="stats-header">
            <button
              className="add-expense-btn"
              onClick={() => navigate("/Gerenciador-de-veiculos")}
            >
              <Plus size={20} />
              <span>Gerenciador de Veículos</span>
            </button>
          </div>

          <div className="vehicles-grid">
            {cars.map((car) => (
              <div key={car._id || car.placa} className="vehicle-card">
                <div className="vehicle-header">
                  <div className="vehicle-info">
                    <h3>{car.modelo}</h3>
                    <span className="vehicle-plate">{car.placa}</span>
                  </div>
                  <Car className="text-blue-500" size={24} />
                </div>

                <div className="fuel-section">
                  <div className="fuel-header">
                    <span className="fuel-label">Nível de Combustível</span>
                    <span className="fuel-label">{car.fuelLevel}%</span>
                  </div>
                  <div className="fuel-gauge">
                    <div
                      className={`fuel-level ${getFuelLevelClass(
                        car.fuelLevel
                      )}`}
                      style={{ width: `${car.fuelLevel}%` }}
                    />
                  </div>
                </div>

                <div className="vehicle-stats">
                  <div className="vehicle-stat">
                    <div className="vehicle-stat-header">
                      <Calendar size={16} />
                      <span>Quilometragem</span>
                    </div>
                    <span className="vehicle-stat-value">
                      {Number(car.mileage).toLocaleString("pt-BR")} km
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DrivingSchoolDashboard;
