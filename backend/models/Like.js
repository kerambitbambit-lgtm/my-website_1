const { pool } = require('./db');

class Like {
  /**
   * Добавить лайк
   */
  static async add(itemId, userId) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO likes (item_id, user_id) VALUES (?, ?)',
        [itemId, userId]
      );
      return { id: result.insertId, item_id: itemId, user_id: userId };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return null; // Лайк уже существует
      }
      throw error;
    }
  }

  /**
   * Удалить лайк
   */
  static async remove(itemId, userId) {
    const [result] = await pool.execute(
      'DELETE FROM likes WHERE item_id = ? AND user_id = ?',
      [itemId, userId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Проверить, лайкнул ли пользователь запись
   */
  static async isLiked(itemId, userId) {
    const [rows] = await pool.execute(
      'SELECT id FROM likes WHERE item_id = ? AND user_id = ?',
      [itemId, userId]
    );
    return rows.length > 0;
  }

  /**
   * Получить количество лайков записи
   */
  static async countByItem(itemId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM likes WHERE item_id = ?',
      [itemId]
    );
    return rows[0].count;
  }

  /**
   * Получить пользователей, лайкнувших запись
   */
  static async getUsersByItem(itemId) {
    const [rows] = await pool.execute(
      `SELECT u.id, u.username 
       FROM likes l 
       JOIN users u ON l.user_id = u.id 
       WHERE l.item_id = ?`,
      [itemId]
    );
    return rows;
  }
}

module.exports = Like;
