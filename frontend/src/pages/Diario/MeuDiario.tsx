import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { visitasAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Visita } from '../../types';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
import './Diario.css';

export default function MeuDiario() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalCidades: 0,
    totalPaises: 0,
    totalContinentes: 0,
  });
  const { usuario } = useAuth();

  useEffect(() => {
    if (usuario) {
      carregarVisitas();
    }
  }, [usuario]);

  const carregarVisitas = async (pageNum: number = 1) => {
    if (!usuario) return;

    try {
      setLoading(true);
      const response = await visitasAPI.listarPorUsuario(usuario.id, pageNum, 20);
      const data = response.data;
      setVisitas(data.data);
      setTotalPages(data.pagination.totalPages);
      setPage(data.pagination.page);

      // Calcular estatísticas
      calcularEstatisticas(data.data);
    } catch (error) {
      setErro('Erro ao carregar suas visitas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = (visitasData: Visita[]) => {
    const paisesUnicos = new Set(visitasData.map(v => v.cidade?.pais?.id).filter(Boolean));
    const continentesUnicos = new Set(
      visitasData.map(v => v.cidade?.pais?.continente?.id).filter(Boolean)
    );

    setStats({
      totalCidades: visitasData.length,
      totalPaises: paisesUnicos.size,
      totalContinentes: continentesUnicos.size,
    });
  };

  const handlePageChange = (newPage: number) => {
    carregarVisitas(newPage);
  };

  const handleRemoverVisita = async (visitaId: number) => {
    if (!confirm('Deseja realmente remover esta visita?')) return;

    try {
      await visitasAPI.excluir(visitaId);
      carregarVisitas(page);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao remover visita');
    }
  };

  if (!usuario) {
    return (
      <div className="container page-container">
        <div className="card">
          <h2>Acesso Restrito</h2>
          <p>Você precisa estar logado para acessar seu diário de viagem.</p>
          <Link to="/login" className="btn btn-primary">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading && visitas.length === 0) return <Loading />;

  return (
    <div className="container page-container">
      <div className="page-header">
        <h1>Meu Diário de Viagem</h1>
        <Link to="/cidades" className="btn btn-primary">
          + Adicionar Visita
        </Link>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">🏙️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalCidades}</div>
            <div className="stat-label">Cidades Visitadas</div>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">🌎</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalPaises}</div>
            <div className="stat-label">Países Visitados</div>
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">🌍</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalContinentes}</div>
            <div className="stat-label">Continentes Visitados</div>
          </div>
        </div>
      </div>

      {erro && (
        <div className="alert alert-error">{erro}</div>
      )}

      {visitas.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">🗺️</div>
          <h3>Seu diário está vazio</h3>
          <p>Comece a marcar as cidades que você já visitou!</p>
          <Link to="/cidades" className="btn btn-primary">
            Explorar Cidades
          </Link>
        </div>
      ) : (
        <>
          <div className="visitas-list">
            {visitas.map((visita) => (
              <div key={visita.id} className="visita-card">
                <div className="visita-header">
                  <div className="visita-title">
                    {visita.cidade?.pais?.codigoISO && (
                      <img
                        src={`https://flagcdn.com/24x18/${visita.cidade.pais.codigoISO.toLowerCase()}.png`}
                        alt={`Bandeira ${visita.cidade?.pais?.nome}`}
                        className="flag-icon"
                      />
                    )}
                    <div>
                      <Link to={`/cidades/${visita.cidade?.id}`} className="cidade-link">
                        <h3>{visita.cidade?.nome}</h3>
                      </Link>
                      <p className="cidade-location">
                        {visita.cidade?.pais?.nome}
                        {visita.cidade?.pais?.continente?.nome && (
                          <> • {visita.cidade.pais.continente.nome}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="visita-date">
                    📅 {new Date(visita.dataVisita).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {visita.comentario && (
                  <div className="visita-comentario">
                    <p>💬 {visita.comentario}</p>
                  </div>
                )}

                <div className="visita-footer">
                  <Link
                    to={`/visitas/${visita.id}/editar`}
                    className="btn btn-sm btn-outline"
                  >
                    ✏️ Editar Comentário
                  </Link>
                  <button
                    onClick={() => handleRemoverVisita(visita.id)}
                    className="btn btn-sm btn-danger"
                  >
                    🗑️ Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
