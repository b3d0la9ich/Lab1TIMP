import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export default function Navbar() {
  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    logout(); // сбрасывает контекст
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Главная страница
      </NavLink>

      <NavLink to="/baggage" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Сканер багажа
      </NavLink>

      <NavLink to="/person" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Сканер человека
      </NavLink>

      {role === 'admin' && (
        <NavLink to="/incidents" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Инциденты
        </NavLink>
      )}

      {!role ? (
        <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Вход
        </NavLink>
      ) : (
        <button onClick={handleLogout} className="nav-link">Выйти</button>
      )}
    </nav>
  );
}
