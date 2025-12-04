import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { continentesAPI } from '../../services/api';
import { Continente } from '../../types';
import Loading from '../../components/Loading';
import './Continentes.css';

export default function FormContinente() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [erro, setErro] = useState('');
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      carregarContinente();
    }
  }, [id]);

  const carregarContinente = async () => {
    try {
      setLoadingData(true);
      const response = await continentesAPI.buscarPorId(Number(id));
      const continente: Continente = response.data;
      setNome(continente.nome);
      setDescricao(continente.descricao || '');
    } catch (error) {
      setErro('Erro ao carregar continente');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      if (isEdit) {
        await continentesAPI.atualizar(Number(id), { nome, descricao });
      } else {
        await continentesAPI.criar({ nome, descricao });
      }
      navigate('/continentes');
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao salvar continente');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <Loading />;

  return (
    <div className="container page-container">
      <div className="form-page">
        <div className="card">
          <div className="card-header">
            <h2>{isEdit ? '✏️ Editar Continente' : 'Novo Continente'}</h2>
          </div>

          {erro && (
            <div className="alert alert-error">{erro}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome" className="form-label">
                Nome do Continente *
              </label>
              <input
                id="nome"
                type="text"
                className="form-input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: América do Sul"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="descricao" className="form-label">
                Descrição
              </label>
              <textarea
                id="descricao"
                className="form-textarea"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Adicione uma descrição sobre o continente (opcional)"
                rows={4}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/continentes')}
                className="btn btn-outline"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
