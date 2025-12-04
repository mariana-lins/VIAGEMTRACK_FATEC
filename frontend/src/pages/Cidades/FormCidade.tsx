import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { cidadesAPI, paisesAPI, externalAPI } from '../../services/api';
import { Cidade, Pais } from '../../types';
import Loading from '../../components/Loading';
import './Cidades.css';

export default function FormCidade() {
  const [nome, setNome] = useState('');
  const [paisId, setPaisId] = useState<number | ''>('');
  const [populacao, setPopulacao] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [clima, setClima] = useState('');
  const [paises, setPaises] = useState<Pais[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingGeoNames, setLoadingGeoNames] = useState(false);
  const [erro, setErro] = useState('');
  
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  useEffect(() => {
    carregarPaises();
    
    // Se vier de /paises/:id com query param, preenche o país
    const paisIdParam = searchParams.get('paisId');
    if (paisIdParam) {
      setPaisId(Number(paisIdParam));
    }

    if (isEdit) {
      carregarCidade();
    }
  }, [id]);

  const carregarPaises = async () => {
    try {
      const response = await paisesAPI.listar(1, 100);
      setPaises(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar países:', error);
    }
  };

  const carregarCidade = async () => {
    try {
      setLoadingData(true);
      const response = await cidadesAPI.buscarPorId(Number(id));
      const cidade: Cidade = response.data;
      setNome(cidade.nome);
      setPaisId(cidade.paisId);
      setPopulacao(cidade.populacao ? String(cidade.populacao) : '');
      setLatitude(cidade.latitude ? String(cidade.latitude) : '');
      setLongitude(cidade.longitude ? String(cidade.longitude) : '');
      setClima(cidade.clima || '');
    } catch (error) {
      setErro('Erro ao carregar cidade');
    } finally {
      setLoadingData(false);
    }
  };

  const buscarDadosCidade = async () => {
    if (!nome) {
      alert('Informe o Nome da cidade primeiro');
      return;
    }

    try {
      setLoadingGeoNames(true);
      setErro('');
      
      // Buscar cidade no GeoNames
      const response = await externalAPI.buscarCidades(nome, 5);
      const cidades = response.data;

      if (cidades && cidades.length > 0) {
        // Pegar a primeira cidade (mais populosa)
        const cidade = cidades[0];
        
        setNome(cidade.name);
        if (!latitude) setLatitude(String(cidade.lat));
        if (!longitude) setLongitude(String(cidade.lng));
        if (!populacao && cidade.population) setPopulacao(String(cidade.population));
        
        // Tentar encontrar o país correspondente
        if (!paisId) {
          const paisEncontrado = paises.find(p => 
            p.codigoISO?.toUpperCase() === cidade.countryCode.toUpperCase()
          );
          if (paisEncontrado) {
            setPaisId(paisEncontrado.id);
          }
        }
        
        alert(`Dados carregados: ${cidade.name}, ${cidade.countryName}\nVerifique os campos.`);
      } else {
        alert('Nenhuma cidade encontrada com este nome.');
      }
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao buscar dados da cidade');
    } finally {
      setLoadingGeoNames(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!paisId) {
      setErro('Selecione um país');
      return;
    }

    setLoading(true);

    try {
      const dados = {
        nome,
        paisId: Number(paisId),
        populacao: populacao ? Number(populacao) : undefined,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        clima: clima || undefined,
      };

      if (isEdit) {
        await cidadesAPI.atualizar(Number(id), dados);
      } else {
        await cidadesAPI.criar(dados);
      }
      navigate('/cidades');
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao salvar cidade');
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
            <h2>{isEdit ? '✏️ Editar Cidade' : 'Nova Cidade'}</h2>
          </div>

          {erro && (
            <div className="alert alert-error">{erro}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nome" className="form-label">
                  Nome da Cidade *
                </label>
                <div className="input-with-button">
                  <input
                    id="nome"
                    type="text"
                    className="form-input"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: São Paulo"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={buscarDadosCidade}
                    className="btn btn-secondary btn-sm"
                    disabled={loadingGeoNames || !nome}
                    title="Buscar dados da cidade no GeoNames"
                  >
                    {loadingGeoNames ? '⏳' : '🌐'} Buscar Dados
                  </button>
                </div>
                <small className="form-hint">
                  Digite o nome e clique em "Buscar Dados" para preencher automaticamente
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="paisId" className="form-label">
                  País *
                </label>
                <select
                  id="paisId"
                  className="form-select"
                  value={paisId}
                  onChange={(e) => setPaisId(Number(e.target.value))}
                  required
                >
                  <option value="">Selecione um país</option>
                  {paises.map((pais) => (
                    <option key={pais.id} value={pais.id}>
                      {pais.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="populacao" className="form-label">
                  População
                </label>
                <input
                  id="populacao"
                  type="number"
                  className="form-input"
                  value={populacao}
                  onChange={(e) => setPopulacao(e.target.value)}
                  placeholder="Ex: 12300000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="clima" className="form-label">
                  Clima
                </label>
                <input
                  id="clima"
                  type="text"
                  className="form-input"
                  value={clima}
                  onChange={(e) => setClima(e.target.value)}
                  placeholder="Ex: Tropical, Temperado..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="latitude" className="form-label">
                  Latitude
                </label>
                <input
                  id="latitude"
                  type="number"
                  step="any"
                  className="form-input"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Ex: -23.5505"
                />
                <small className="form-hint">
                  Valores entre -90 e 90
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="longitude" className="form-label">
                  Longitude
                </label>
                <input
                  id="longitude"
                  type="number"
                  step="any"
                  className="form-input"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Ex: -46.6333"
                />
                <small className="form-hint">
                  Valores entre -180 e 180
                </small>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/cidades')}
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
