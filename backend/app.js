require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Импорт маршрутов
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');
const commentRoutes = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS настройки
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Парсинг JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логгер запросов (для разработки)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Подключение маршрутов API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/comments', commentRoutes);

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка:', err.message);
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    error: err.message || 'Внутренняя ошибка сервера'
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📍 API доступен по адресу: http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
