const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extrai o token do "Bearer <token>"

  if (!token) {
    return res.status(401).send('Token missing. Please log out and log back in.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Adiciona as informações decodificadas do usuário ao objeto de requisição
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

module.exports = authenticateToken;
