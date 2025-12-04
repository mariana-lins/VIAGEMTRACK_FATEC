import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

export default function Home() {
  const { isAuthenticated, usuario } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Bem-vindo ao 🌍ViagemTrack</h1>
          <p className="hero-subtitle">
            Seu diário pessoal de viagens pelo mundo
          </p>
          <p className="hero-description">
            Explore continentes, países e cidades. Registre suas aventuras e 
            acompanhe todos os lugares que você já visitou!
          </p>

          {isAuthenticated ? (
            <div className="hero-actions">
              <Link to="/diario" className="btn btn-primary btn-lg">
                Meu Diário de Viagem
              </Link>
              <Link to="/cidades" className="btn btn-outline btn-lg">
                Explorar Cidades
              </Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link to="/registrar" className="btn btn-primary btn-lg">
                Começar Agora
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Entrar
              </Link>
            </div>
          )}
        </div>
      </section>

      {isAuthenticated && usuario && (
        <section className="user-stats">
          <div className="container">
            <div className="card">
              <h2>Olá, {usuario.nome}! 👋</h2>
              <p>
                Continue explorando o mundo e registrando suas aventuras!
              </p>
              <div className="stats-grid">
                <div className="stat">
                  <div className="stat-value">{usuario._count?.visitas || 0}</div>
                  <div className="stat-label">Cidades Visitadas</div>
                </div>
              </div>
              <Link to="/diario" className="btn btn-primary">
                Ver Meu Diário →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="features">
        <div className="container">
          <h2>Funcionalidades</h2>
          <div className="grid grid-cols-3">
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Explore o Mundo</h3>
              <p>
                Navegue por continentes, países e cidades com informações 
                detalhadas de cada localidade.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Marque suas Visitas</h3>
              <p>
                Registre todas as cidades que você já visitou e adicione 
                comentários sobre suas experiências.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌤️</div>
              <h3>Informações em Tempo Real</h3>
              <p>
                Veja o clima atual de qualquer cidade e informações geográficas 
                atualizadas.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏳️</div>
              <h3>Dados Geográficos</h3>
              <p>
                Acesse informações sobre população, idiomas, moedas e muito mais 
                de cada país.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Estatísticas</h3>
              <p>
                Acompanhe quantas cidades e países você já visitou em seu perfil 
                pessoal.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Cadastro Completo</h3>
              <p>
                Sistema CRUD completo para gerenciar continentes, países e 
                cidades.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
