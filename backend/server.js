require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const exercicioRoutes = require('./routes/exercicioRoutes');

const app = express();

// CORS configurado para aceitar frontend local e produção
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Backend puro para Render - sem frontend estático

// Conexão MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/musclefit')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Erro MongoDB:', err));

// Rotas API
app.use('/api/exercicios', exercicioRoutes);

// Rota raiz API
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 MuscleFit API v1.0 - Backend funcionando!', 
    api: '/api/exercicios',
    health: '/health'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 MuscleFit API v1.0 rodando na porta ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📊 Health: http://localhost:${PORT}/health`);
    console.log(`📋 API: http://localhost:${PORT}/api/exercicios`);
  }
});

module.exports = app;

