import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';

function EditItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const data = await api.getItem(id);
        setTitle(data.item.title);
        setContent(data.item.content || '');
        setTags(data.item.tags ? data.item.tags.join(', ') : '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const tagsArray = tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await api.updateItem(id, {
        title,
        content,
        tags: tagsArray
      });

      navigate(`/item/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="auth-page" style={{ maxWidth: '600px' }}>
      <div className="auth-card">
        <h1 className="auth-title">Редактирование записи</h1>
        
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
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/item/${id}`)}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditItemPage;
