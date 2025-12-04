import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paisesAPI, continentesAPI } from '../../services/api';
import { Pais, Continente, PaginatedResponse } from '../../types';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
import './Paises.css';

export default function ListaPaises() {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [continentes, setContinentes] = useState<Continente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroContinente, setFiltroContinente] = useState<number | ''>('');

  useEffect(() => {
    carregarContinentes();
    carregarPaises();
  }, []);

  const carregarContinentes = async () => {
    try {
      const response = await continentesAPI.listar(1, 100);
      setContinentes(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar continentes:', error);
    }
  };

  const carregarPaises = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const response = await paisesAPI.listar(
        pageNum, 
        10, 
        filtroContinente || undefined
      );
      const data: PaginatedResponse<Pais> = response.data;
      setPaises(data.data);
      setTotalPages(data.pagination.totalPages);
      setPage(data.pagination.page);
    } catch (error) {
      setErro('Erro ao carregar países');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    carregarPaises(newPage);
  };

  const handleFiltrar = () => {
    setPage(1);
    carregarPaises(1);
  };

  const handleLimparFiltros = () => {
    setFiltroNome('');
    setFiltroContinente('');
    setPage(1);
    setTimeout(() => carregarPaises(1), 0);
  };

  const handleDelete = async (id: number) => {
    try {
      await paisesAPI.excluir(id);
      setConfirmDelete(null);
      carregarPaises(page);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao excluir país');
    }
  };

  if (loading && paises.length === 0) return <Loading />;

  return (
    <div className="container page-container">
      <div className="page-header">
        <h1>Países</h1>
        <Link to="/paises/novo" className="btn btn-primary">
          + Novo País
        </Link>
      </div>

      {/* Filtros */}
      <div className="card filters-card">
        <div className="filters-grid">
          <div className="form-group">
            <label htmlFor="filtroNome" className="form-label">Nome do País</label>
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
            <label htmlFor="filtroContinente" className="form-label">Continente</label>
            <select
              id="filtroContinente"
              className="form-select"
              value={filtroContinente}
              onChange={(e) => setFiltroContinente(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Todos os continentes</option>
              {continentes.map((cont) => (
                <option key={cont.id} value={cont.id}>
                  {cont.nome}
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

      {paises.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            {filtroNome || filtroContinente
              ? 'Nenhum país encontrado com os filtros aplicados.'
              : 'Nenhum país cadastrado. Comece criando um novo!'}
          </p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Bandeira</th>
                  <th>Nome</th>
                  <th>Continente</th>
                  <th>Capital</th>
                  <th>População</th>
                  <th>Cidades</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paises.map((pais) => (
                  <tr key={pais.id}>
                    <td>
                      {pais.codigoISO && (
                        <img
                          src={`https://flagcdn.com/24x18/${pais.codigoISO.toLowerCase()}.png`}
                          alt={`Bandeira ${pais.nome}`}
                          className="flag-icon"
                        />
                      )}
                    </td>
                    <td>
                      <Link to={`/paises/${pais.id}`} className="link-hover">
                        <strong>{pais.nome}</strong>
                      </Link>
                    </td>
                    <td>{pais.continente?.nome || '-'}</td>
                    <td>{pais.capital || '-'}</td>
                    <td>
                      {pais.populacao
                        ? new Intl.NumberFormat('pt-BR').format(Number(pais.populacao))
                        : '-'}
                    </td>
                    <td>
                      <span className="badge badge-primary">
                        {pais._count?.cidades || 0} cidades
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/paises/${pais.id}/editar`}
                          className="btn btn-sm btn-outline"
                        >
                          ✏️ Editar
                        </Link>
                        {confirmDelete === pais.id ? (
                          <div className="confirm-delete">
                            <span>Confirmar?</span>
                            <button
                              onClick={() => handleDelete(pais.id)}
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
                            onClick={() => setConfirmDelete(pais.id)}
                            className="btn btn-sm btn-danger"
                          >
                            🗑️ Excluir
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
