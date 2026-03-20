const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { auth, optionalAuth } = require('../middleware/auth');

/**
 * @route GET /api/items
 * @desc Получить все записи с пагинацией и поиском
 * @access Public
 * @query {number} page - Номер страницы
 * @query {number} limit - Количество записей на странице
 * @query {string} search - Поисковый запрос
 */
router.get('/', optionalAuth, itemController.getAll);

/**
 * @route GET /api/items/:id
 * @desc Получить одну запись по ID
 * @access Public
 */
router.get('/:id', optionalAuth, itemController.getById);

/**
 * @route POST /api/items
 * @desc Создать новую запись
 * @access Private
 */
router.post('/', auth, itemController.create);

/**
 * @route PUT /api/items/:id
 * @desc Обновить запись
 * @access Private
 */
router.put('/:id', auth, itemController.update);

/**
 * @route DELETE /api/items/:id
 * @desc Удалить запись
 * @access Private
 */
router.delete('/:id', auth, itemController.remove);

/**
 * @route POST /api/items/:id/likes
 * @desc Добавить лайк
 * @access Private
 */
router.post('/:id/likes', auth, itemController.addLike);

/**
 * @route DELETE /api/items/:id/likes
 * @desc Удалить лайк
 * @access Private
 */
router.delete('/:id/likes', auth, itemController.removeLike);

module.exports = router;
