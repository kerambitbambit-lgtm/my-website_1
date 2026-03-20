import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/api';

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');

  const loadItems = async (pageNum = 1, searchQuery = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getItems(pageNum, 10, searchQuery);
      setItems(data.items);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems(page, search);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadItems(1, search);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="search-box">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flex: 1 }}>
          <input
            type="text"
            className="form-control"
            placeholder="Поиск записей..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Найти
          </button>
        </form>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : items.length === 0 ? (
        <div className="card">
          <p>Записей пока нет. <Link to="/create">Создайте первую!</Link></p>
        </div>
      ) : (
        <>
          <div className="items-list">
            {items.map((item) => (
              <div key={item.id} className="item-card">
                <div className="item-card-content">
                  <h2 className="item-card-title">
                    <Link to={`/item/${item.id}`}>{item.title}</Link>
                  </h2>
                  <div className="item-card-meta">
                    <span>Автор: {item.author_name}</span>
                    {' • '}
                    <span>{formatDate(item.created_at)}</span>
                    {' • '}
                    <span>❤️ {item.likes_count}</span>
                  </div>
                  {item.content && (
                    <p style={{ color: '#666', marginBottom: '10px' }}>
                      {item.content.substring(0, 200)}
                      {item.content.length > 200 && '...'}
                    </p>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="item-card-tags">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                ← Назад
              </button>
              <span style={{ padding: '8px 16px' }}>
                Страница {page} из {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
              >
                Вперёд →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
