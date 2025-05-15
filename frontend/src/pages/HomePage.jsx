import React from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const role = localStorage.getItem('role');

  return (
    <div className="homepage-wrapper">
      <div className="card welcome-card">
        <h1>🚨 Добро пожаловать!</h1>
        <p>Система обеспечения безопасности</p>
        <div className="actions">
          <Link to="/baggage" className="btn blue">🛄 Сканер багажа</Link>
          <Link to="/person" className="btn purple">🧍 Сканер человека</Link>

          {role === 'admin' ? (
            <Link to="/incidents" className="btn green">📋 Журнал инцидентов</Link>
          ) : (
            <Link to="/login" className="btn gray">🔐 Войти как администратор</Link>
          )}
        </div>
      </div>
    </div>
  );
}
