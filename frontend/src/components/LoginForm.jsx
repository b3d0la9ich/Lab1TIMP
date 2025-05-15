import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError('Имя и пароль не могут быть пустыми или состоять только из пробелов.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        username: trimmedUsername,
        password: trimmedPassword
      });

      if (res.data.success) {
        login(res.data.token, res.data.role);
        navigate('/');
      } else {
        setError(res.data.error || 'Ошибка входа');
      }
    } catch (err) {
      setError('Ошибка сервера');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>🔐 Вход в систему</h2>
        {error && <p className="error-msg">{error}</p>}
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}