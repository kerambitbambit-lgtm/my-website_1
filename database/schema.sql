-- Схема базы данных для проекта "Сайт СИП"
-- Создайте базу данных my_website_db с кодировкой utf8mb4_unicode_ci
-- Затем выполните этот SQL-скрипт

CREATE DATABASE IF NOT EXISTS my_website_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE my_website_db;

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  avatar     VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица записей (посты/товары/статьи)
CREATE TABLE IF NOT EXISTS items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  content    TEXT,
  image      VARCHAR(255) DEFAULT NULL,
  tags       JSON DEFAULT NULL,
  user_id    INT NOT NULL,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица лайков
CREATE TABLE IF NOT EXISTS likes (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (item_id, user_id),
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_item_id (item_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица комментариев
CREATE TABLE IF NOT EXISTS comments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  content    TEXT NOT NULL,
  item_id    INT NOT NULL,
  user_id    INT NOT NULL,
  parent_id  INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
  INDEX idx_item_id (item_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Триггер для обновления счётчика лайков при добавлении
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS after_like_insert
AFTER INSERT ON likes
FOR EACH ROW
BEGIN
  UPDATE items SET likes_count = likes_count + 1 WHERE id = NEW.item_id;
END$$
DELIMITER ;

-- Триггер для обновления счётчика лайков при удалении
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS after_like_delete
AFTER DELETE ON likes
FOR EACH ROW
BEGIN
  UPDATE items SET likes_count = likes_count - 1 WHERE id = OLD.item_id;
END$$
DELIMITER ;

-- Тестовые данные
INSERT INTO users (username, email, password) VALUES
('admin', 'admin@example.com', '$2a$10$XQxNkRzJzLzJzLzJzLzJzOQxNkRzJzLzJzLzJzLzJzLzJzLzJzLz'),
('user1', 'user1@example.com', '$2a$10$XQxNkRzJzLzJzLzJzLzJzOQxNkRzJzLzJzLzJzLzJzLzJzLzJzLz'),
('user2', 'user2@example.com', '$2a$10$XQxNkRzJzLzJzLzJzLzJzOQxNkRzJzLzJzLzJzLzJzLzJzLzJzLz');

INSERT INTO items (title, content, tags, user_id, likes_count) VALUES
('Первая запись', 'Это содержание первой записи. Добро пожаловать на наш сайт!', '["новости", "привет"]', 1, 5),
('Вторая запись', 'Содержание второй записи. Здесь мы обсуждаем важные темы.', '["обсуждение", "важное"]', 2, 3),
('Третья запись', 'Третья запись в нашем блоге. Продолжаем развивать проект.', '["блог", "развитие"]', 1, 7);

INSERT INTO comments (content, item_id, user_id) VALUES
('Отличная запись!', 1, 2),
('Согласен, очень интересно.', 1, 3),
('Жду продолжения!', 2, 1);

INSERT INTO likes (item_id, user_id) VALUES
(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2);
