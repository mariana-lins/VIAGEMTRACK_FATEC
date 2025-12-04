import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { visitasAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Visita } from '../../types';
import Loading from '../../components/Loading';
import './Diario.css';

export default function EditarVisita() {
  const [comentario, setComentario] = useState('');
  const [dataVisita, setDataVisita] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [erro, setErro] = useState('');
  const [visita, setVisita] = useState<Visita | null>(null);
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  useEffect(() => {
    if (id && usuario) {
      carregarVisita();
    }
  }, [id, usuario]);

  const carregarVisita = async () => {
    try {
      setLoadingData(true);
      const response = await visitasAPI.listarPorUsuario(usuario!.id);
      const visitaEncontrada = response.data.data.find(v => v.id === Number(id));
      
      if (visitaEncontrada) {
        setVisita(visitaEncontrada);
        setComentario(visitaEncontrada.comentario || '');
        setDataVisita(visitaEncontrada.dataVisita.split('T')[0]);
      } else {
        setErro('Visita não encontrada');
      }
    } catch (error) {
      setErro('Erro ao carregar visita');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await visitasAPI.atualizar(Number(id), {
        comentario: comentario || undefined,
        dataVisita: dataVisita ? new Date(dataVisita).toISOString() : undefined,
      });
      navigate('/diario');
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao atualizar visita');
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return (
      <div className="container page-container">
        <div className="card">
          <h2>Acesso Restrito</h2>
          <p>Você precisa estar logado para editar visitas.</p>
        </div>
      </div>
    );
  }

  if (loadingData) return <Loading />;

  return (
    <div className="container page-container">
      <div className="form-page">
        <div className="card">
          <div className="card-header">
            <h2>✏️ Editar Visita</h2>
            {visita?.cidade && (
              <p className="subtitle">{visita.cidade.nome}, {visita.cidade.pais?.nome}</p>
            )}
          </div>

          {erro && (
            <div className="alert alert-error">{erro}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="dataVisita" className="form-label">
                Data da Visita *
              </label>
              <input
                id="dataVisita"
                type="date"
                className="form-input"
                value={dataVisita}
                onChange={(e) => setDataVisita(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="comentario" className="form-label">
                Comentário / Observações
              </label>
              <textarea
                id="comentario"
                className="form-textarea"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Adicione suas memórias e observações sobre esta visita..."
                rows={6}
              />
              <small className="form-hint">
                Compartilhe suas experiências, dicas e momentos marcantes!
              </small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/diario')}
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
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
