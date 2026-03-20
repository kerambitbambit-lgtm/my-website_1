# Сайт СИП — Проектная работа

Полноценный веб-сайт с возможностью создания записей, комментирования, лайков и авторизации пользователей.

## 🛠 Стек технологий

| Слой | Технология |
|------|-----------|
| Фронтенд | React 18 + React Router v6 |
| Бэкенд | Node.js + Express |
| База данных | MySQL |
| Аутентификация | JWT (JSON Web Token) |

## 📁 Структура проекта

```
my-website/
├── backend/              # Бэкенд (Node.js + Express)
│   ├── controllers/      # Бизнес-логика
│   ├── models/           # Работа с БД
│   ├── routes/           # Маршруты API
│   ├── middleware/       # Middleware (auth, cors)
│   ├── .env              # Переменные окружения
│   ├── app.js            # Точка входа
│   └── package.json
├── frontend/             # Фронтенд (React)
│   ├── public/           # Статические файлы
│   ├── src/
│   │   ├── api/          # API-запросы
│   │   ├── components/   # React-компоненты
│   │   ├── context/      # Context API
│   │   ├── pages/        # Страницы
│   │   ├── styles/       # CSS стили
│   │   ├── App.js        # Главный компонент
│   │   └── index.js      # Точка входа
│   └── package.json
├── database/
│   └── schema.sql        # Схема базы данных
└── README.md
```

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
# Бэкенд
cd backend
npm install

# Фронтенд
cd ../frontend
npm install
```

### 2. Настройка базы данных

1. Откройте phpMyAdmin (обычно http://localhost/phpmyadmin)
2. Создайте базу данных `my_website_db` с кодировкой `utf8mb4_unicode_ci`
3. Выполните SQL-скрипт из файла `database/schema.sql`

### 3. Настройка окружения

Создайте файл `backend/.env` (или скопируйте `.env.example`):

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=my_website_db
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 4. Запуск проекта

**Терминал 1 — Бэкенд:**
```bash
cd backend
npm run dev
```
Бэкенд доступен по адресу: http://localhost:3001

**Терминал 2 — Фронтенд:**
```bash
cd frontend
npm start
```
Фронтенд доступен по адресу: http://localhost:3000

## 📡 API Документация

### Аутентификация

| Метод | Маршрут | Описание |
|-------|---------|----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| POST | `/api/auth/logout` | Выход |
| GET | `/api/auth/me` | Текущий пользователь |

### Записи (Items)

| Метод | Маршрут | Описание |
|-------|---------|----------|
| GET | `/api/items` | Список записей |
| GET | `/api/items/:id` | Одна запись |
| POST | `/api/items` | Создать запись |
| PUT | `/api/items/:id` | Обновить запись |
| DELETE | `/api/items/:id` | Удалить запись |
| POST | `/api/items/:id/likes` | Лайк |
| DELETE | `/api/items/:id/likes` | Удалить лайк |

### Комментарии

| Метод | Маршрут | Описание |
|-------|---------|----------|
| GET | `/api/items/:itemId/comments` | Комментарии к записи |
| POST | `/api/items/:itemId/comments` | Создать комментарий |
| PUT | `/api/comments/:id` | Обновить комментарий |
| DELETE | `/api/comments/:id` | Удалить комментарий |

### Примеры запросов

**Регистрация:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"student","email":"test@mail.ru","password":"123456"}'
```

**Вход:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@mail.ru","password":"123456"}'
```

**Создание записи (с токеном):**
```bash
curl -X POST http://localhost:3001/api/items \
  -H "Authorization: Bearer ВАШ_ТОКЕН" \
  -H "Content-Type: application/json" \
  -d '{"title":"Тест","content":"Текст записи","tags":["тест"]}'
```

## 🧪 Тестирование

### Ручное тестирование

1. Зарегистрируйте нового пользователя
2. Войдите в систему
3. Создайте новую запись
4. Добавьте лайк и комментарий
5. Отредактируйте и удалите запись

### Проверка API через Postman/curl

Используйте примеры выше для тестирования конечных точек.

## 📊 Критерии оценки

| Критерий | Баллы |
|---------|-------|
| Схема БД создана, таблицы заполнены | 5 |
| Регистрация и вход работают | 8 |
| CRUD основной сущности | 12 |
| Лайки (POST/DELETE) | 5 |
| Комментарии (CRUD) | 6 |
| Поиск/фильтрация | 4 |
| Фронтенд отображает данные | 5 |
| README.md заполнен | 3 |
| Тесты проходят | 2 |
| **ИТОГО** | **50** |

## 👨‍💻 Автор

Студент группы СИП-423,433,443
ГБПОУ КСТ им. М.Ф. Панова

## 📅 Дата сдачи

20 марта 2026 г.
