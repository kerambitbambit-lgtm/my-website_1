const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { auth } = require('../middleware/auth');

/**
 * @route GET /api/items/:itemId/comments
 * @desc Получить все комментарии к записи
 * @access Public
 */
router.get('/items/:itemId/comments', commentController.getByItem);

/**
 * @route POST /api/items/:itemId/comments
 * @desc Создать комментарий к записи
 * @access Private
 */
router.post('/items/:itemId/comments', auth, commentController.create);

/**
 * @route PUT /api/comments/:id
 * @desc Обновить комментарий
 * @access Private
 */
router.put('/:id', auth, commentController.update);

/**
 * @route DELETE /api/comments/:id
 * @desc Удалить комментарий
 * @access Private
 */
router.delete('/:id', auth, commentController.remove);

module.exports = router;
