import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cidadesAPI, externalAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Cidade } from '../../types';
import Loading from '../../components/Loading';
import './Cidades.css';

export default function DetalhesCidade() {
  const [cidade, setCidade] = useState<Cidade | null>(null);
  const [clima, setClima] = useState<any>(null);
  const [loadingClima, setLoadingClima] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const { usuario, recarregarUsuario } = useAuth();
  
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    carregarCidade();
  }, [id]);

  const carregarCidade = async () => {
    try {
      setLoading(true);
      const response = await cidadesAPI.buscarPorId(Number(id));
      setCidade(response.data);
      
      // Se tem coordenadas, busca clima automaticamente
      if (response.data.latitude && response.data.longitude) {
        buscarClima(Number(response.data.latitude), Number(response.data.longitude));
      }
    } catch (error) {
      setErro('Erro ao carregar dados da cidade');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const buscarClima = async (lat: number, lon: number) => {
    try {
      setLoadingClima(true);
      const response = await externalAPI.buscarClima(lat, lon);
      setClima(response.data);
    } catch (error) {
      console.error('Erro ao buscar clima:', error);
    } finally {
      setLoadingClima(false);
    }
  };

  const handleMarcarVisitada = async () => {
    if (!usuario || !cidade) return;

    try {
      await cidadesAPI.marcarComoVisitada(usuario.id, cidade.id);
      alert('Cidade marcada como visitada! ✓');
      await recarregarUsuario(); // Atualiza contador na home
      carregarCidade();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao marcar cidade como visitada');
    }
  };

  if (loading) return <Loading />;
  if (erro || !cidade) {
    return (
      <div className="container page-container">
        <div className="alert alert-error">{erro || 'Cidade não encontrada'}</div>
        <Link to="/cidades" className="btn btn-outline">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="container page-container">
      <div className="page-header">
        <div>
          <Link to="/cidades" className="breadcrumb">
            ← Voltar para Cidades
          </Link>
          <h1>
            {cidade.nome}
            {cidade.visitada && (
              <span className="badge badge-success" style={{ marginLeft: '1rem' }}>
                ✓ Visitada
              </span>
            )}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {usuario && !cidade.visitada && (
            <button onClick={handleMarcarVisitada} className="btn btn-success">
              ✓ Marcar como Visitada
            </button>
          )}
          <Link to={`/cidades/${cidade.id}/editar`} className="btn btn-primary">
            ✏️ Editar
          </Link>
        </div>
      </div>

      <div className="details-grid">
        <div className="card">
          <h3>Informações Gerais</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">País:</span>
              <span className="info-value">
                {cidade.pais ? (
                  <Link to={`/paises/${cidade.pais.id}`} className="link-hover">
                    {cidade.pais.nome}
                  </Link>
                ) : '-'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">População:</span>
              <span className="info-value">
                {cidade.populacao
                  ? new Intl.NumberFormat('pt-BR').format(Number(cidade.populacao))
                  : '-'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Clima:</span>
              <span className="info-value">{cidade.clima || '-'}</span>
            </div>
            {(cidade.latitude && cidade.longitude) && (
              <>
                <div className="info-item">
                  <span className="info-label">Latitude:</span>
                  <span className="info-value">{Number(cidade.latitude).toFixed(4)}°</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Longitude:</span>
                  <span className="info-value">{Number(cidade.longitude).toFixed(4)}°</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Widget de Clima */}
        {(cidade.latitude && cidade.longitude) && (
          <div className="card">
            <h3>🌤️ Clima Atual</h3>
            {loadingClima ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Loading />
              </div>
            ) : clima ? (
              <div className="weather-widget">
                <div className="weather-main">
                  <img
                    src={clima.current?.condition?.icon}
                    alt={clima.current?.condition?.text}
                    className="weather-icon"
                  />
                  <div>
                    <div className="weather-temp">
                      {clima.current?.temp_c}°C
                    </div>
                    <div className="weather-condition">
                      {clima.current?.condition?.text}
                    </div>
                  </div>
                </div>
                <div className="weather-details">
                  <div className="weather-detail-item">
                    <span>💨 Vento:</span>
                    <strong>{clima.current?.wind_kph} km/h</strong>
                  </div>
                  <div className="weather-detail-item">
                    <span>💧 Umidade:</span>
                    <strong>{clima.current?.humidity}%</strong>
                  </div>
                  <div className="weather-detail-item">
                    <span>👁️ Visibilidade:</span>
                    <strong>{clima.current?.vis_km} km</strong>
                  </div>
                  <div className="weather-detail-item">
                    <span>🌡️ Sensação:</span>
                    <strong>{clima.current?.feelslike_c}°C</strong>
                  </div>
                </div>
                <div className="weather-location">
                  📍 {clima.location?.name}, {clima.location?.country}
                </div>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                Dados de clima não disponíveis
              </p>
            )}
          </div>
        )}

        {/* Mapa (placeholder) */}
        {(cidade.latitude && cidade.longitude) && (
          <div className="card">
            <h3>Localização</h3>
            <div className="map-placeholder">
              <p>📍 {Number(cidade.latitude).toFixed(4)}°, {Number(cidade.longitude).toFixed(4)}°</p>
              <a
                href={`https://www.google.com/maps?q=${cidade.latitude},${cidade.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                Abrir no Google Maps
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
