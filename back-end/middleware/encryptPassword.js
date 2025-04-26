const bcrypt = require('bcrypt');

// Middleware de pré-salvamento para criptografar a senha
const encryptPassword = async function (next) {
  try {
    // Verificar se a senha foi modificada
    if (!this.isModified('password')) return next();

    // Gerar o salt
    const salt = await bcrypt.genSalt(10);
    // Criptografar a senha com o salt
    this.password = await bcrypt.hash(this.password, salt);

    next(); // Chamar o próximo middleware
  } catch (error) {
    next(error); // Passar erros para o próximo middleware
  }
};

module.exports = encryptPassword;
