const jwt = require('jsonwebtoken');

/**
 * Middleware для проверки JWT токена
 * Добавляет пользователя в req.user если токен валиден
 */
const auth = (req, res, next) => {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Токен не предоставлен' });
    }

    // Формат: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Неверный формат токена' });
    }

    // Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Добавляем информацию о пользователе в запрос
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Срок действия токена истёк' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Неверный токен' });
    }
    console.error('Ошибка аутентификации:', error.message);
    return res.status(500).json({ error: 'Ошибка аутентификации' });
  }
};

/**
 * Опциональная аутентификация - не ошибка если токена нет
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          id: decoded.id,
          email: decoded.email,
          username: decoded.username
        };
      }
    }
    next();
  } catch (error) {
    // Игнорируем ошибки, продолжаем без аутентификации
    next();
  }
};

module.exports = { auth, optionalAuth };
