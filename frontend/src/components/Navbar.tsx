import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { usuario, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          🌍 ViagemTrack
        </Link>

        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/continentes">Continentes</Link></li>
          <li><Link to="/paises">Países</Link></li>
          <li><Link to="/cidades">Cidades</Link></li>
          
          {isAuthenticated && (
            <li><Link to="/diario" className="navbar-link-diario">Meu Diário</Link></li>
          )}
        </ul>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <span className="navbar-user">Olá, {usuario?.nome}</span>
              <button onClick={logout} className="btn btn-outline btn-sm">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Entrar
              </Link>
              <Link to="/registrar" className="btn btn-primary btn-sm">
                Registrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
