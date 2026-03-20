import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Сайт СИП
        </Link>
        <nav className="nav">
          <Link to="/">Главная</Link>
          {isAuthenticated ? (
            <>
              <Link to="/create" className="btn btn-primary btn-sm">
                + Новая запись
              </Link>
              <Link to="/profile">{user.username}</Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Выход
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Вход
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
