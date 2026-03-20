import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [userItems, setUserItems] = useState([]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      loadUserItems();
    }
  }, [user]);

  const loadUserItems = async () => {
    try {
      const data = await api.getItems(1, 10);
      const myItems = data.items.filter(item => item.user_id === user.id);
      setUserItems(myItems);
    } catch (err) {
      console.error('Ошибка загрузки записей:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.updateProfile(username, null);
      setSuccess('Профиль успешно обновлён');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="auth-page" style={{ maxWidth: '600px' }}>
      <div className="auth-card">
        <h1 className="auth-title">Профиль</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
          <p><strong>ID:</strong> {user?.id}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Зарегистрирован:</strong> {user?.created_at ? formatDate(user.created_at) : 'Н/Д'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={2}
              maxLength={50}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>

        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

        <h2 style={{ fontSize: '1.25rem', marginBottom: '15px' }}>Мои записи</h2>
        
        {userItems.length === 0 ? (
          <p style={{ color: '#757575' }}>У вас пока нет записей.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {userItems.map(item => (
              <div key={item.id} style={{ padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                <a href={`/item/${item.id}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                  {item.title}
                </a>
                <span style={{ color: '#757575', fontSize: '0.875rem', marginLeft: '10px' }}>
                  ({item.likes_count} ❤️)
                </span>
              </div>
            ))}
          </div>
        )}

        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

        <button onClick={handleLogout} className="btn btn-danger">
          Выйти
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
