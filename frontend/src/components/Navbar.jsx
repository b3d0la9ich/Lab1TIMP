import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/baggage" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Сканер багажа
      </NavLink>
      <NavLink to="/person" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Сканер человека
      </NavLink>
      <NavLink to="/incidents" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Инциденты
      </NavLink>
    </nav>
  );
}
