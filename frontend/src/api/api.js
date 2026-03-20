const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Произошла ошибка');
  }
  return data;
};

export const api = {
  // Аутентификация
  async login(email, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  async register(username, email, password) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, email, password })
    });
    return handleResponse(response);
  },

  async logout() {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async getCurrentUser() {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Записи
  async getItems(page = 1, limit = 10, search = '') {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append('search', search);
    const response = await fetch(`${API_BASE}/items?${params}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async getItem(id) {
    const response = await fetch(`${API_BASE}/items/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async createItem(item) {
    const response = await fetch(`${API_BASE}/items`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(item)
    });
    return handleResponse(response);
  },

  async updateItem(id, item) {
    const response = await fetch(`${API_BASE}/items/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(item)
    });
    return handleResponse(response);
  },

  async deleteItem(id) {
    const response = await fetch(`${API_BASE}/items/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async addLike(id) {
    const response = await fetch(`${API_BASE}/items/${id}/likes`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async removeLike(id) {
    const response = await fetch(`${API_BASE}/items/${id}/likes`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Комментарии
  async getComments(itemId) {
    const response = await fetch(`${API_BASE}/items/${itemId}/comments`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async createComment(itemId, content, parentId = null) {
    const response = await fetch(`${API_BASE}/items/${itemId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content, parent_id: parentId })
    });
    return handleResponse(response);
  },

  async updateComment(id, content) {
    const response = await fetch(`${API_BASE}/comments/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ content })
    });
    return handleResponse(response);
  },

  async deleteComment(id) {
    const response = await fetch(`${API_BASE}/comments/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Пользователи
  async getUser(id) {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async updateProfile(username, avatar) {
    const response = await fetch(`${API_BASE}/users/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ username, avatar })
    });
    return handleResponse(response);
  }
};
