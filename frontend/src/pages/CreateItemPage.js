import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';

function CreateItemPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const tagsArray = tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await api.createItem({
        title,
        content,
        tags: tagsArray
      });

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ maxWidth: '600px' }}>
      <div className="auth-card">
        <h1 className="auth-title">Новая запись</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Заголовок</label>
            <input
              type="text"
              id="title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={255}
              placeholder="Введите заголовок"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Содержание</label>
            <textarea
              id="content"
              className="form-control"
              rows="8"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Напишите содержание записи..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Теги (через запятую)</label>
            <input
              type="text"
              id="tags"
              className="form-control"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="новости, блог, важное"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Создание...' : 'Создать'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateItemPage;
