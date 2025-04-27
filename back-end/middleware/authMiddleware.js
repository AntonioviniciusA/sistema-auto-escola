// Middleware auth.js (adicione logs)
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  // console.log("Authorization Header:", authHeader); // Debug

  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    console.log("Token não encontrado");
    return res.status(401).json({ message: "Acesso negado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Token decodificado:", decoded); // Debug
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Erro na verificação:", error.message); // Debug detalhado
    res.status(400).json({ message: "Token inválido" });
  }
};
