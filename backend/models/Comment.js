const { pool } = require('./db');

class Comment {
  /**
   * Получить все комментарии к записи
   */
  static async findByItem(itemId) {
    const [rows] = await pool.execute(
      `SELECT c.*, u.username as author_name 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.item_id = ? AND c.parent_id IS NULL
       ORDER BY c.created_at DESC`,
      [itemId]
    );
    
    // Загружаем ответы на комментарии
    for (const comment of rows) {
      const [replies] = await pool.execute(
        `SELECT c.*, u.username as author_name 
         FROM comments c 
         JOIN users u ON c.user_id = u.id 
         WHERE c.parent_id = ?
         ORDER BY c.created_at ASC`,
        [comment.id]
      );
      comment.replies = replies;
    }
    
    return rows;
  }

  /**
   * Получить комментарий по ID
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT c.*, u.username as author_name 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Создать комментарий
   */
  static async create({ content, item_id, user_id, parent_id = null }) {
    const [result] = await pool.execute(
      'INSERT INTO comments (content, item_id, user_id, parent_id) VALUES (?, ?, ?, ?)',
      [content, item_id, user_id, parent_id]
    );
    
    return await this.findById(result.insertId);
  }

  /**
   * Обновить комментарий
   */
  static async update(id, content) {
    await pool.execute(
      'UPDATE comments SET content = ? WHERE id = ?',
      [content, id]
    );
    
    return await this.findById(id);
  }

  /**
   * Удалить комментарий
   */
  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM comments WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Проверить принадлежность комментария пользователю
   */
  static async isOwner(commentId, userId) {
    const [rows] = await pool.execute(
      'SELECT id FROM comments WHERE id = ? AND user_id = ?',
      [commentId, userId]
    );
    return rows.length > 0;
  }

  /**
   * Получить количество комментариев к записи
   */
  static async countByItem(itemId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM comments WHERE item_id = ?',
      [itemId]
    );
    return rows[0].count;
  }
}

module.exports = Comment;
