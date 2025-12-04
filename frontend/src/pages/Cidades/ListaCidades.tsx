import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cidadesAPI, paisesAPI } from '../../services/api';
import { Cidade, Pais, PaginatedResponse } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
import './Cidades.css';

export default function ListaCidades() {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroPais, setFiltroPais] = useState<number | ''>('');
  const { usuario, recarregarUsuario } = useAuth();

  useEffect(() => {
    carregarPaises();
    carregarCidades();
  }, []);

  const carregarPaises = async () => {
    try {
      const response = await paisesAPI.listar(1, 100);
      setPaises(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar países:', error);
    }
  };

  const carregarCidades = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const response = await cidadesAPI.listar(
        pageNum,
        10,
        filtroPais || undefined,
        undefined
      );
      const data: PaginatedResponse<Cidade> = response.data;
      setCidades(data.data);
      setTotalPages(data.pagination.totalPages);
      setPage(data.pagination.page);
    } catch (error) {
      setErro('Erro ao carregar cidades');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    carregarCidades(newPage);
  };

  const handleFiltrar = () => {
    setPage(1);
    carregarCidades(1);
  };

  const handleLimparFiltros = () => {
    setFiltroNome('');
    setFiltroPais('');
    setPage(1);
    setTimeout(() => carregarCidades(1), 0);
  };

  const handleDelete = async (id: number) => {
    try {
      await cidadesAPI.excluir(id);
      setConfirmDelete(null);
      carregarCidades(page);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao excluir cidade');
    }
  };

  const handleMarcarVisitada = async (cidadeId: number) => {
    if (!usuario) {
      alert('Você precisa estar logado para marcar cidades como visitadas');
      return;
    }

    try {
      await cidadesAPI.marcarComoVisitada(usuario.id, cidadeId);
      alert('Cidade marcada como visitada! ✓');
      await recarregarUsuario(); // Atualiza contador na home
      carregarCidades(page);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao marcar cidade como visitada');
    }
  };

  if (loading && cidades.length === 0) return <Loading />;

  return (
    <div className="container page-container">
      <div className="page-header">
        <h1>Cidades</h1>
        <Link to="/cidades/novo" className="btn btn-primary">
          + Nova Cidade
        </Link>
      </div>

      {/* Filtros */}
      <div className="card filters-card">
        <div className="filters-grid">
          <div className="form-group">
            <label htmlFor="filtroNome" className="form-label">Nome da Cidade</label>
            <input
              id="filtroNome"
              type="text"
              className="form-input"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              placeholder="Buscar por nome..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="filtroPais" className="form-label">País</label>
            <select
              id="filtroPais"
              className="form-select"
              value={filtroPais}
              onChange={(e) => setFiltroPais(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Todos os países</option>
              {paises.map((pais) => (
                <option key={pais.id} value={pais.id}>
                  {pais.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filters-actions">
          <button onClick={handleLimparFiltros} className="btn btn-outline btn-sm">
            Limpar Filtros
          </button>
          <button onClick={handleFiltrar} className="btn btn-primary btn-sm">
            Filtrar
          </button>
        </div>
      </div>

      {erro && (
        <div className="alert alert-error">{erro}</div>
      )}

      {cidades.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            {filtroNome || filtroPais
              ? 'Nenhuma cidade encontrada com os filtros aplicados.'
              : 'Nenhuma cidade cadastrada. Comece criando uma nova!'}
          </p>
        </div>
      ) : (
        <>
          <div className="cidades-grid">
            {cidades.map((cidade) => (
              <div key={cidade.id} className="cidade-card">
                <div className="cidade-card-header">
                  <h3>
                    <Link to={`/cidades/${cidade.id}`} className="link-hover">
                      {cidade.nome}
                    </Link>
                  </h3>
                  {cidade.visitada && (
                    <span className="badge badge-success">✓ Visitada</span>
                  )}
                </div>

                <div className="cidade-card-body">
                  <p className="cidade-info">
                    <span className="info-icon">🌍</span>
                    <strong>{cidade.pais?.nome || '-'}</strong>
                  </p>
                  
                  {cidade.populacao && (
                    <p className="cidade-info">
                      <span className="info-icon">👥</span>
                      {new Intl.NumberFormat('pt-BR').format(Number(cidade.populacao))} hab.
                    </p>
                  )}

                  {(cidade.latitude && cidade.longitude) && (
                    <p className="cidade-info">
                      <span className="info-icon">📍</span>
                      {Number(cidade.latitude).toFixed(4)}, {Number(cidade.longitude).toFixed(4)}
                    </p>
                  )}
                </div>

                <div className="cidade-card-footer">
                  {usuario && !cidade.visitada && (
                    <button
                      onClick={() => handleMarcarVisitada(cidade.id)}
                      className="btn btn-sm btn-success"
                    >
                      ✓ Marcar como Visitada
                    </button>
                  )}
                  
                  <div className="action-buttons">
                    <Link
                      to={`/cidades/${cidade.id}/editar`}
                      className="btn btn-sm btn-outline"
                    >
                      ✏️ Editar
                    </Link>
                    {confirmDelete === cidade.id ? (
                      <div className="confirm-delete">
                        <span>Confirmar?</span>
                        <button
                          onClick={() => handleDelete(cidade.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Sim
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="btn btn-sm btn-outline"
                        >
                          Não
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(cidade.id)}
                        className="btn btn-sm btn-danger"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
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
