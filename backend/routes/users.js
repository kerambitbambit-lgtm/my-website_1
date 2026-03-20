const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

/**
 * @route GET /api/users/me
 * @desc Получить профиль текущего пользователя
 * @access Private
 */
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /api/users/me
 * @desc Обновить профиль текущего пользователя
 * @access Private
 */
router.put('/me', auth, async (req, res, next) => {
  try {
    const { username, avatar } = req.body;
    const user = await User.update(req.user.id, { username, avatar });
    res.json({ message: 'Профиль обновлён', user });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/users/:id
 * @desc Получить профиль пользователя по ID
 * @access Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
