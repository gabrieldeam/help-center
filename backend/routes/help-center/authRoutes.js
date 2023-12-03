const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/help-center/user'); 

// Rota para registro de usuário
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Verifique se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Crie um novo usuário com senha hash
    const newUser = new User({ email, password });
    
    // Salve o usuário no banco de dados
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Rota para login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Encontrar o usuário pelo email
    const user = await User.findOne({ email });

    // Verificar se o usuário existe
    if (!user) {
      return res.status(401).json({ message: 'Autenticação falhou. Usuário não encontrado.' });
    }

    // Verificar a senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Autenticação falhou. Senha incorreta.' });
    }

    // Gerar token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar o token como cookie seguro
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // Enviar o token também como parte do corpo da resposta
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
