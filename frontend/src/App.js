import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ItemPage from './pages/ItemPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreateItemPage from './pages/CreateItemPage';
import EditItemPage from './pages/EditItemPage';
import { useAuth } from './context/AuthContext';

// Компонент для защищённых маршрутов
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreateItemPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/item/:id/edit"
            element={
              <PrivateRoute>
                <EditItemPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <footer className="footer">
        <p>&copy; 2026 Сайт СИП. Проектная работа.</p>
      </footer>
    </div>
  );
}

export default App;
