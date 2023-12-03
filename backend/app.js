require('dotenv').config();
console.log('Chave secreta JWT:', process.env.JWT_SECRET || 'NÃO DEFINIDA MANUALMENTE');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/help-center/authRoutes');
const topicRoutes = require('./routes/help-center/topics');
const sectionRoutes = require('./routes/help-center/sections');
const articleRoutes = require('./routes/help-center/articles');

const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configuração para servir arquivos estáticos na pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurar o cors para permitir solicitações de http://localhost:4200
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:59104'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

// Configuração do MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/helpcenter');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(bodyParser.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/topic', topicRoutes);
app.use('/section', sectionRoutes);
app.use('/article', articleRoutes);

// Porta
app.listen(PORT, () => {
  console.log(`Servidor está rodando em http://localhost:${PORT}`);
});