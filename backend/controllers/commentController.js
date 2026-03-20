const Comment = require('../models/Comment');
const Item = require('../models/Item');

/**
 * Получить все комментарии к записи
 * GET /api/items/:itemId/comments
 */
const getByItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);
    
    if (!item) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    const comments = await Comment.findByItem(req.params.itemId);
    
    res.json({ comments });
  } catch (error) {
    console.error('Ошибка получения комментариев:', error);
    next(error);
  }
};

/**
 * Создать комментарий
 * POST /api/items/:itemId/comments
 */
const create = async (req, res, next) => {
  try {
    const { content, parent_id } = req.body;

    // Валидация
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Текст комментария обязателен' });
    }

    if (content.length > 2000) {
      return res.status(400).json({ error: 'Комментарий слишком длинный' });
    }

    // Проверка существования записи
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    // Если это ответ на комментарий, проверяем его существование
    if (parent_id) {
      const parentComment = await Comment.findById(parent_id);
      if (!parentComment || parentComment.item_id != req.params.itemId) {
        return res.status(404).json({ error: 'Родительский комментарий не найден' });
      }
    }

    const comment = await Comment.create({
      content: content.trim(),
      item_id: parseInt(req.params.itemId),
      user_id: req.user.id,
      parent_id: parent_id ? parseInt(parent_id) : null
    });

    res.status(201).json({
      message: 'Комментарий успешно создан',
      comment
    });
  } catch (error) {
    console.error('Ошибка создания комментария:', error);
    next(error);
  }
};

/**
 * Обновить комментарий
 * PUT /api/comments/:id
 */
const update = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Комментарий не найден' });
    }

    // Проверка прав доступа
    if (comment.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }

    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Текст комментария обязателен' });
    }

    const updatedComment = await Comment.update(req.params.id, content.trim());

    res.json({
      message: 'Комментарий успешно обновлён',
      comment: updatedComment
    });
  } catch (error) {
    console.error('Ошибка обновления комментария:', error);
    next(error);
  }
};

/**
 * Удалить комментарий
 * DELETE /api/comments/:id
 */
const remove = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Комментарий не найден' });
    }

    // Проверка прав доступа
    if (comment.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }

    await Comment.delete(req.params.id);

    res.json({ message: 'Комментарий успешно удалён' });
  } catch (error) {
    console.error('Ошибка удаления комментария:', error);
    next(error);
  }
};

module.exports = {
  getByItem,
  create,
  update,
  remove
};
