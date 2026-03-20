/**
 * Простые тесты для API
 * Запуск: npm test
 */

const assert = require('assert');

const API_BASE = 'http://localhost:3001/api';

// Тестовые данные
const testUser = {
  username: 'testuser',
  email: `test${Date.now()}@mail.ru`,
  password: 'test123456'
};

let authToken = '';
let itemId = null;

async function test(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   ${error.message}`);
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  return data;
}

async function runTests() {
  console.log('\n🧪 Запуск тестов API...\n');

  // 1. Регистрация
  await test('Регистрация пользователя', async () => {
    const data = await fetchJson(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(testUser)
    });
    assert.ok(data.token, 'Токен не получен');
    assert.ok(data.user, 'Данные пользователя не получены');
    authToken = data.token;
  });

  // 2. Вход
  await test('Вход в систему', async () => {
    const data = await fetchJson(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    assert.ok(data.token, 'Токен не получен при входе');
  });

  // 3. Получение текущего пользователя
  await test('Получение профиля', async () => {
    const data = await fetchJson(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert.ok(data.user, 'Данные профиля не получены');
    assert.strictEqual(data.user.email, testUser.email);
  });

  // 4. Создание записи
  await test('Создание записи', async () => {
    const data = await fetchJson(`${API_BASE}/items`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        title: 'Тестовая запись',
        content: 'Содержание тестовой записи',
        tags: ['тест', 'api']
      })
    });
    assert.ok(data.item, 'Запись не создана');
    assert.strictEqual(data.item.title, 'Тестовая запись');
    itemId = data.item.id;
  });

  // 5. Получение списка записей
  await test('Получение списка записей', async () => {
    const data = await fetchJson(`${API_BASE}/items?page=1&limit=10`);
    assert.ok(data.items, 'Список записей не получен');
    assert.ok(Array.isArray(data.items));
  });

  // 6. Получение одной записи
  await test('Получение одной записи', async () => {
    const data = await fetchJson(`${API_BASE}/items/${itemId}`);
    assert.ok(data.item, 'Запись не найдена');
    assert.strictEqual(data.item.id, itemId);
  });

  // 7. Добавление лайка
  await test('Добавление лайка', async () => {
    const data = await fetchJson(`${API_BASE}/items/${itemId}/likes`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert.ok(data.likesCount !== undefined, 'Счётчик лайков не получен');
  });

  // 8. Создание комментария
  await test('Создание комментария', async () => {
    const data = await fetchJson(`${API_BASE}/items/${itemId}/comments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ content: 'Тестовый комментарий' })
    });
    assert.ok(data.comment, 'Комментарий не создан');
  });

  // 9. Получение комментариев
  await test('Получение комментариев', async () => {
    const data = await fetchJson(`${API_BASE}/items/${itemId}/comments`);
    assert.ok(data.comments, 'Комментарии не получены');
  });

  // 10. Обновление записи
  await test('Обновление записи', async () => {
    const data = await fetchJson(`${API_BASE}/items/${itemId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ title: 'Обновлённая запись' })
    });
    assert.strictEqual(data.item.title, 'Обновлённая запись');
  });

  // 11. Удаление лайка
  await test('Удаление лайка', async () => {
    const data = await fetchJson(`${API_BASE}/items/${itemId}/likes`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert.ok(data.likesCount !== undefined, 'Счётчик лайков не получен');
  });

  // 12. Удаление записи
  await test('Удаление записи', async () => {
    await fetchJson(`${API_BASE}/items/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });
  });

  // 13. Поиск записей
  await test('Поиск записей', async () => {
    const data = await fetchJson(`${API_BASE}/items?search=тест`);
    assert.ok(data.items !== undefined, 'Результат поиска не получен');
  });

  console.log('\n✅ Тесты завершены!\n');
}

runTests().catch(console.error);
