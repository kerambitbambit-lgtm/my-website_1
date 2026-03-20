const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Регистрация нового пользователя
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Валидация входных данных
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
    }

    if (username.length < 2 || username.length > 50) {
      return res.status(400).json({ error: 'Имя пользователя должно быть от 2 до 50 символов' });
    }

    // Проверка email на валидность
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Некорректный email' });
    }

    // Проверка существования пользователя
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Создание пользователя
    const user = await User.create({ username, email, password });

    // Генерация токена
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    next(error);
  }
};

/**
 * Вход в систему
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Валидация
    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    // Поиск пользователя
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isValid = await User.verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Генерация токена
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Вход выполнен успешно',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    next(error);
  }
};

/**
 * Выход из системы
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  // В Stateless JWT logout не требует действий на сервере
  // Клиент просто удаляет токен
  res.json({ message: 'Выход выполнен успешно' });
};

/**
 * Получить текущего пользователя
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser
};
