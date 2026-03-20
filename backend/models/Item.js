const { pool } = require('./db');

class Item {
  /**
   * Получить все записи с пагинацией
   */
  static async findAll(limit = 10, offset = 0, search = null) {
    let query = `
      SELECT i.*, u.username as author_name 
      FROM items i 
      JOIN users u ON i.user_id = u.id
    `;
    
    const params = [];
    
    if (search) {
      query += ' WHERE i.title LIKE ? OR i.content LIKE ?';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    query += ' ORDER BY i.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  /**
   * Получить общее количество записей
   */
  static async getCount(search = null) {
    if (search) {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM items WHERE title LIKE ? OR content LIKE ?',
        [`%${search}%`, `%${search}%`]
      );
      return rows[0].count;
    }
    
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM items');
    return rows[0].count;
  }

  /**
   * Получить запись по ID
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT i.*, u.username as author_name 
       FROM items i 
       JOIN users u ON i.user_id = u.id 
       WHERE i.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Создать новую запись
   */
  static async create({ title, content, tags, user_id, image = null }) {
    const tagsJson = tags ? JSON.stringify(tags) : null;
    
    const [result] = await pool.execute(
      'INSERT INTO items (title, content, tags, user_id, image) VALUES (?, ?, ?, ?, ?)',
      [title, content, tagsJson, user_id, image]
    );
    
    return await this.findById(result.insertId);
  }

  /**
   * Обновить запись
   */
  static async update(id, { title, content, tags, image }) {
    const fields = [];
    const values = [];
    
    if (title !== undefined) {
      fields.push('title = ?');
      values.push(title);
    }
    if (content !== undefined) {
      fields.push('content = ?');
      values.push(content);
    }
    if (tags !== undefined) {
      fields.push('tags = ?');
      values.push(tags ? JSON.stringify(tags) : null);
    }
    if (image !== undefined) {
      fields.push('image = ?');
      values.push(image);
    }
    
    if (fields.length === 0) {
      return await this.findById(id);
    }
    
    values.push(id);
    
    await pool.execute(
      `UPDATE items SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return await this.findById(id);
  }

  /**
   * Удалить запись
   */
  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM items WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Проверить принадлежность записи пользователю
   */
  static async isOwner(itemId, userId) {
    const [rows] = await pool.execute(
      'SELECT id FROM items WHERE id = ? AND user_id = ?',
      [itemId, userId]
    );
    return rows.length > 0;
  }

  /**
   * Получить записи пользователя
   */
  static async findByUser(userId, limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT i.*, u.username as author_name 
       FROM items i 
       JOIN users u ON i.user_id = u.id 
       WHERE i.user_id = ? 
       ORDER BY i.created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows;
  }
}

module.exports = Item;
