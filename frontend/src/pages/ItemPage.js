import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

function ItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadItem = async () => {
    try {
      const data = await api.getItem(id);
      setItem(data.item);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadComments = async () => {
    try {
      const data = await api.getComments(id);
      setComments(data.comments);
    } catch (err) {
      console.error('Ошибка загрузки комментариев:', err);
    }
  };

  useEffect(() => {
    Promise.all([loadItem(), loadComments()]).finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      if (item.isLiked) {
        await api.removeLike(id);
      } else {
        await api.addLike(id);
      }
      loadItem();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) return;
    try {
      await api.deleteItem(id);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setSubmitting(true);
    try {
      await api.createComment(id, commentText);
      setCommentText('');
      loadComments();
      loadItem();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Удалить комментарий?')) return;
    try {
      await api.deleteComment(commentId);
      loadComments();
    } catch (err) {
      setError(err.message);
    }
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

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error && !item) return <div className="alert alert-error">{error}</div>;
  if (!item) return <div className="loading">Запись не найдена</div>;

  return (
    <div className="item-page">
      <h1 className="item-page-title">{item.title}</h1>
      
      <div className="item-page-meta">
        <span>Автор: <strong>{item.author_name}</strong></span>
        {' • '}
        <span>{formatDate(item.created_at)}</span>
        {' • '}
        <span>❤️ {item.likes_count}</span>
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="item-card-tags" style={{ marginBottom: '20px' }}>
          {item.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="item-page-content">
        {item.content || 'Нет содержания'}
      </div>

      <div className="item-page-actions">
        <button 
          className={`btn like-btn ${item.isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {item.isLiked ? '❤️' : '🤍'} {item.isLiked ? 'Лайкнуто' : 'Лайк'}
        </button>
        
        {user && user.id === item.user_id && (
          <>
            <Link to={`/item/${id}/edit`} className="btn btn-secondary">
              Редактировать
            </Link>
            <button className="btn btn-danger" onClick={handleDelete}>
              Удалить
            </button>
          </>
        )}
      </div>

      <div className="comments-section">
        <h2 className="comments-title">
          Комментарии ({comments.length})
        </h2>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <div className="form-group">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Напишите комментарий..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={submitting}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Отправка...' : 'Отправить'}
            </button>
          </form>
        ) : (
          <p>
            <Link to="/login">Войдите</Link>, чтобы оставить комментарий.
          </p>
        )}

        <div className="comment-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.author_name}</span>
                <span className="comment-date">{formatDate(comment.created_at)}</span>
              </div>
              <div className="comment-content">{comment.content}</div>
              {user && user.id === comment.user_id && (
                <div className="comment-actions">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Удалить
                  </button>
                </div>
              )}
              {comment.replies && comment.replies.length > 0 && (
                <div className="comment-replies">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="comment-item" style={{ marginBottom: '10px' }}>
                      <div className="comment-header">
                        <span className="comment-author">{reply.author_name}</span>
                        <span className="comment-date">{formatDate(reply.created_at)}</span>
                      </div>
                      <div className="comment-content">{reply.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {comments.length === 0 && (
            <p style={{ color: '#757575' }}>Комментариев пока нет. Будьте первым!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemPage;
