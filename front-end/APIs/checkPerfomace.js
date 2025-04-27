import axios from "axios";

// Função para verificar a performance e o espaço do banco de dados
const checkPerformance = async () => {
  try {
    // Chama a verificação de performance para estudantes
    const performanceResponse = await axios.get(
      "https://sistemaautoescola.onrender.com/api/performance/checkPerformance"
    );
    console.log(
      "Resultado da verificação de performance:",
      performanceResponse.data
    );
  } catch (error) {
    console.error("Erro ao verificar a performance:", error);
  }

  try {
    // Chama a verificação de espaço no banco de dados
    const storageResponse = await axios.get(
      "https://sistemaautoescola.onrender.com/api/performance/checkStorage"
    );
    console.log(
      "Resultado da verificação de espaço no banco de dados:",
      storageResponse.data
    );
  } catch (error) {
    console.error("Erro ao verificar o espaço do banco de dados:", error);
  }
};

// Exporta a função para ser chamada em outro lugar
export default checkPerformance;
