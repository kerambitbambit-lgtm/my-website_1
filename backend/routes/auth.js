const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

/**
 * @route POST /api/auth/register
 * @desc Регистрация нового пользователя
 * @access Public
 */
router.post('/register', authController.register);

/**
 * @route POST /api/auth/login
 * @desc Вход в систему
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route POST /api/auth/logout
 * @desc Выход из системы
 * @access Public
 */
router.post('/logout', authController.logout);

/**
 * @route GET /api/auth/me
 * @desc Получить текущего пользователя
 * @access Private
 */
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;
