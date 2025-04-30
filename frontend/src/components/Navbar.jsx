import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <Link to="/baggage">Сканер багажа</Link> |{" "}
      <Link to="/person">Сканер человека</Link> |{" "}
      <Link to="/incidents">Инциденты</Link>
    </nav>
  );
}