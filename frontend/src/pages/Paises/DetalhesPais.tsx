import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { paisesAPI, cidadesAPI } from '../../services/api';
import { Pais, Cidade, PaginatedResponse } from '../../types';
import Loading from '../../components/Loading';
import './Paises.css';

export default function DetalhesPais() {
  const [pais, setPais] = useState<Pais | null>(null);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [paisResponse, cidadesResponse] = await Promise.all([
        paisesAPI.buscarPorId(Number(id)),
        cidadesAPI.listar(1, 100, Number(id))
      ]);

      setPais(paisResponse.data);
      const cidadesData: PaginatedResponse<Cidade> = cidadesResponse.data;
      setCidades(cidadesData.data);
    } catch (error) {
      setErro('Erro ao carregar dados do país');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (erro || !pais) {
    return (
      <div className="container page-container">
        <div className="alert alert-error">{erro || 'País não encontrado'}</div>
        <Link to="/paises" className="btn btn-outline">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="container page-container">
      <div className="page-header">
        <div>
          <Link to="/paises" className="breadcrumb">
            ← Voltar para Países
          </Link>
          <h1>
            {pais.codigoISO && (
              <img
                src={`https://flagcdn.com/48x36/${pais.codigoISO.toLowerCase()}.png`}
                alt={`Bandeira ${pais.nome}`}
                className="flag-icon-large"
              />
            )}
            {pais.nome}
          </h1>
        </div>
        <Link to={`/paises/${pais.id}/editar`} className="btn btn-primary">
          ✏️ Editar País
        </Link>
      </div>

      <div className="details-grid">
        <div className="card">
          <h3>📋 Informações Gerais</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Continente:</span>
              <span className="info-value">{pais.continente?.nome || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Código ISO:</span>
              <span className="info-value">{pais.codigoISO || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Capital:</span>
              <span className="info-value">{pais.capital || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">População:</span>
              <span className="info-value">
                {pais.populacao
                  ? new Intl.NumberFormat('pt-BR').format(Number(pais.populacao))
                  : '-'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Idioma:</span>
              <span className="info-value">{pais.idioma || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Moeda:</span>
              <span className="info-value">{pais.moeda || '-'}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Cidades ({cidades.length})</h3>
            <Link to={`/cidades/novo?paisId=${pais.id}`} className="btn btn-sm btn-primary">
              + Nova Cidade
            </Link>
          </div>
          
          {cidades.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              Nenhuma cidade cadastrada ainda.
            </p>
          ) : (
            <div className="cidade-list">
              {cidades.map((cidade) => (
                <Link
                  key={cidade.id}
                  to={`/cidades/${cidade.id}`}
                  className="cidade-item"
                >
                  <div>
                    <strong>{cidade.nome}</strong>
                    {cidade.populacao && (
                      <small>
                        {' '}• {new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(Number(cidade.populacao))} hab.
                      </small>
                    )}
                  </div>
                  <span className="arrow">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
