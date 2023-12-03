const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Verifica se o token está presente no cabeçalho de autorização
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token de autenticação ausente.' });
    }

    // Verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: false });

    // Adiciona os dados do usuário decodificados ao objeto de requisição para uso posterior
    req.userData = decoded;

    // Chama o próximo middleware na cadeia
    next();
  } catch (error) {
    // Trata erros específicos de JWT e outros erros
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Falha na autenticação. Token inválido.' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Falha na autenticação. Token expirado.' });
    } else {
      // Loga outros erros no console para fins de depuração
      console.error(error);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
};
