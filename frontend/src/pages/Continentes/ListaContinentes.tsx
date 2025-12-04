import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { continentesAPI } from '../../services/api';
import { Continente, PaginatedResponse } from '../../types';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
import './Continentes.css';

export default function ListaContinentes() {
  const [continentes, setContinentes] = useState<Continente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const carregarContinentes = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const response = await continentesAPI.listar(pageNum, 10);
      const data: PaginatedResponse<Continente> = response.data;
      setContinentes(data.data);
      setTotalPages(data.pagination.totalPages);
      setPage(data.pagination.page);
    } catch (error) {
      setErro('Erro ao carregar continentes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarContinentes();
  }, []);

  const handlePageChange = (newPage: number) => {
    carregarContinentes(newPage);
  };

  const handleDelete = async (id: number) => {
    try {
      await continentesAPI.excluir(id);
      setConfirmDelete(null);
      carregarContinentes(page);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao excluir continente');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container page-container">
      <div className="page-header">
        <h1>Continentes</h1>
        <Link to="/continentes/novo" className="btn btn-primary">
          + Novo Continente
        </Link>
      </div>

      {erro && (
        <div className="alert alert-error">{erro}</div>
      )}

      {continentes.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            Nenhum continente cadastrado. Comece criando um novo!
          </p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Países</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {continentes.map((continente) => (
                  <tr key={continente.id}>
                    <td>
                      <strong>{continente.nome}</strong>
                    </td>
                    <td>{continente.descricao || '-'}</td>
                    <td>
                      <span className="badge badge-primary">
                        {continente._count?.paises || 0} países
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/continentes/${continente.id}/editar`}
                          className="btn btn-sm btn-outline"
                        >
                          ✏️ Editar
                        </Link>
                        {confirmDelete === continente.id ? (
                          <div className="confirm-delete">
                            <span>Confirmar?</span>
                            <button
                              onClick={() => handleDelete(continente.id)}
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
                            onClick={() => setConfirmDelete(continente.id)}
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
