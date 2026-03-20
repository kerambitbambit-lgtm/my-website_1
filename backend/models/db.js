const mysql = require('mysql2/promise');
require('dotenv').config();

// Создаем пул подключений к базе данных
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'my_website_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Проверка подключения
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Подключение к базе данных успешно');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error.message);
    return false;
  }
}

module.exports = { pool, testConnection };
