const Item = require('../models/Item');
const Like = require('../models/Like');
const Comment = require('../models/Comment');

/**
 * Получить все записи с пагинацией и поиском
 * GET /api/items
 */
const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const offset = (page - 1) * limit;

    const [items, totalCount] = await Promise.all([
      Item.findAll(limit, offset, search),
      Item.getCount(search)
    ]);

    // Парсим JSON теги
    const parsedItems = items.map(item => ({
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : []
    }));

    res.json({
      items: parsedItems,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Ошибка получения записей:', error);
    next(error);
  }
};

/**
 * Получить одну запись по ID
 * GET /api/items/:id
 */
const getById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    // Парсим теги
    item.tags = item.tags ? JSON.parse(item.tags) : [];

    // Проверяем, лайкнул ли текущий пользователь
    if (req.user) {
      item.isLiked = await Like.isLiked(item.id, req.user.id);
    } else {
      item.isLiked = false;
    }

    // Получаем количество комментариев
    item.commentsCount = await Comment.countByItem(item.id);

    res.json({ item });
  } catch (error) {
    console.error('Ошибка получения записи:', error);
    next(error);
  }
};

/**
 * Создать новую запись
 * POST /api/items
 */
const create = async (req, res, next) => {
  try {
    const { title, content, tags, image } = req.body;

    // Валидация
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Заголовок обязателен' });
    }

    if (title.length > 255) {
      return res.status(400).json({ error: 'Заголовок слишком длинный' });
    }

    const item = await Item.create({
      title: title.trim(),
      content: content || '',
      tags: tags || [],
      image: image || null,
      user_id: req.user.id
    });

    item.tags = item.tags ? JSON.parse(item.tags) : [];

    res.status(201).json({
      message: 'Запись успешно создана',
      item
    });
  } catch (error) {
    console.error('Ошибка создания записи:', error);
    next(error);
  }
};

/**
 * Обновить запись
 * PUT /api/items/:id
 */
const update = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    // Проверка прав доступа
    if (item.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }

    const { title, content, tags, image } = req.body;

    const updatedItem = await Item.update(req.params.id, {
      title,
      content,
      tags,
      image
    });

    updatedItem.tags = updatedItem.tags ? JSON.parse(updatedItem.tags) : [];

    res.json({
      message: 'Запись успешно обновлена',
      item: updatedItem
    });
  } catch (error) {
    console.error('Ошибка обновления записи:', error);
    next(error);
  }
};

/**
 * Удалить запись
 * DELETE /api/items/:id
 */
const remove = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    // Проверка прав доступа
    if (item.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }

    await Item.delete(req.params.id);

    res.json({ message: 'Запись успешно удалена' });
  } catch (error) {
    console.error('Ошибка удаления записи:', error);
    next(error);
  }
};

/**
 * Добавить лайк
 * POST /api/items/:id/likes
 */
const addLike = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    const result = await Like.add(item.id, req.user.id);
    
    if (result === null) {
      return res.status(400).json({ error: 'Вы уже лайкнули эту запись' });
    }

    const updatedItem = await Item.findById(item.id);
    updatedItem.tags = updatedItem.tags ? JSON.parse(updatedItem.tags) : [];

    res.json({
      message: 'Лайк добавлен',
      likesCount: updatedItem.likes_count
    });
  } catch (error) {
    console.error('Ошибка добавления лайка:', error);
    next(error);
  }
};

/**
 * Удалить лайк
 * DELETE /api/items/:id/likes
 */
const removeLike = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    await Like.remove(item.id, req.user.id);

    const updatedItem = await Item.findById(item.id);
    updatedItem.tags = updatedItem.tags ? JSON.parse(updatedItem.tags) : [];

    res.json({
      message: 'Лайк удалён',
      likesCount: updatedItem.likes_count
    });
  } catch (error) {
    console.error('Ошибка удаления лайка:', error);
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  addLike,
  removeLike
};
