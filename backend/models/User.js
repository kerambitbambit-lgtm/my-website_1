const bcrypt = require('bcryptjs');
const { pool } = require('./db');

class User {
  /**
   * Найти пользователя по email
   */
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  /**
   * Найти пользователя по ID
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, avatar, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Создать нового пользователя
   */
  static async create({ username, email, password }) {
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    return {
      id: result.insertId,
      username,
      email,
      created_at: new Date()
    };
  }

  /**
   * Проверка пароля
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Обновить профиль пользователя
   */
  static async update(id, { username, avatar }) {
    const fields = [];
    const values = [];
    
    if (username) {
      fields.push('username = ?');
      values.push(username);
    }
    if (avatar !== undefined) {
      fields.push('avatar = ?');
      values.push(avatar);
    }
    
    if (fields.length === 0) {
      return await this.findById(id);
    }
    
    values.push(id);
    
    await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return await this.findById(id);
  }

  /**
   * Удалить пользователя
   */
  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Получить всех пользователей (для админа)
   */
  static async findAll(limit = 100, offset = 0) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, created_at FROM users LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }
}

module.exports = User;
