import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { paisesAPI, continentesAPI, externalAPI } from '../../services/api';
import { Pais, Continente } from '../../types';
import Loading from '../../components/Loading';
import './Paises.css';

export default function FormPais() {
  const [nome, setNome] = useState('');
  const [codigoISO, setCodigoISO] = useState('');
  const [capital, setCapital] = useState('');
  const [populacao, setPopulacao] = useState('');
  const [idioma, setIdioma] = useState('');
  const [moeda, setMoeda] = useState('');
  const [continenteId, setContinenteId] = useState<number | ''>('');
  const [continentes, setContinentes] = useState<Continente[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingGeoNames, setLoadingGeoNames] = useState(false);
  const [erro, setErro] = useState('');
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  useEffect(() => {
    carregarContinentes();
    if (isEdit) {
      carregarPais();
    }
  }, [id]);

  const carregarContinentes = async () => {
    try {
      const response = await continentesAPI.listar(1, 100);
      setContinentes(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar continentes:', error);
    }
  };

  const carregarPais = async () => {
    try {
      setLoadingData(true);
      const response = await paisesAPI.buscarPorId(Number(id));
      const pais: Pais = response.data;
      setNome(pais.nome);
      setCodigoISO(pais.codigoISO || '');
      setCapital(pais.capital || '');
      setPopulacao(pais.populacao ? String(pais.populacao) : '');
      setIdioma(pais.idioma || '');
      setMoeda(pais.moeda || '');
      setContinenteId(pais.continenteId);
    } catch (error) {
      setErro('Erro ao carregar país');
    } finally {
      setLoadingData(false);
    }
  };

  const buscarDadosGeoNames = async () => {
    if (!codigoISO) {
      alert('Informe o Código ISO do país primeiro (ex: BR, US, PT)');
      return;
    }

    try {
      setLoadingGeoNames(true);
      setErro('');
      const response = await externalAPI.buscarPaisPorCodigo(codigoISO.toUpperCase());
      const dados = response.data;

      if (dados) {
        if (!nome) setNome(dados.countryName || '');
        if (!capital) setCapital(dados.capital || '');
        if (!populacao) setPopulacao(String(dados.population || ''));
        
        alert('Dados carregados do GeoNames! Verifique os campos.');
      } else {
        alert('Nenhum dado encontrado para este código ISO.');
      }
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao buscar dados do GeoNames');
    } finally {
      setLoadingGeoNames(false);
    }
  };

  const buscarDadosPorNome = async () => {
    if (!nome) {
      alert('Informe o Nome do país primeiro (ex: Brasil, França, Japão)');
      return;
    }

    try {
      setLoadingGeoNames(true);
      setErro('');
      const response = await externalAPI.buscarPaisPorNome(nome);
      const dados = response.data;

      if (dados) {
        setNome(dados.countryName || nome);
        if (!codigoISO) setCodigoISO(dados.countryCode || '');
        if (!capital) setCapital(dados.capital || '');
        if (!populacao) setPopulacao(String(dados.population || ''));
        
        alert('Dados carregados do GeoNames! Verifique os campos.');
      } else {
        alert('Nenhum dado encontrado para este nome de país.');
      }
    } catch (error: any) {
      setErro(error.response?.data?.error || 'País não encontrado. Tente outro nome.');
    } finally {
      setLoadingGeoNames(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!continenteId) {
      setErro('Selecione um continente');
      return;
    }

    setLoading(true);

    try {
      const dados = {
        nome,
        codigoISO: codigoISO || undefined,
        capital: capital || undefined,
        populacao: populacao ? Number(populacao) : undefined,
        idioma: idioma || undefined,
        moeda: moeda || undefined,
        continenteId: Number(continenteId),
      };

      if (isEdit) {
        await paisesAPI.atualizar(Number(id), dados);
      } else {
        await paisesAPI.criar(dados);
      }
      navigate('/paises');
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao salvar país');
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
            <h2>{isEdit ? '✏️ Editar País' : 'Novo País'}</h2>
          </div>

          {erro && (
            <div className="alert alert-error">{erro}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nome" className="form-label">
                  Nome do País *
                </label>
                <div className="input-with-button">
                  <input
                    id="nome"
                    type="text"
                    className="form-input"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Brasil"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={buscarDadosPorNome}
                    className="btn btn-secondary btn-sm"
                    disabled={loadingGeoNames || !nome}
                    title="Buscar dados do país pelo nome"
                  >
                    {loadingGeoNames ? '⏳' : '🌐'} Buscar por Nome
                  </button>
                </div>
                <small className="form-hint" style={{ color: 'var(--aviso)' }}>
                  Apenas nomes em inglês (ex: Brazil, France, Japan)
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="codigoISO" className="form-label">
                  Código ISO
                </label>
                <div className="input-with-button">
                  <input
                    id="codigoISO"
                    type="text"
                    className="form-input"
                    value={codigoISO}
                    onChange={(e) => setCodigoISO(e.target.value.toUpperCase())}
                    placeholder="Ex: BR"
                    maxLength={2}
                  />
                  <button
                    type="button"
                    onClick={buscarDadosGeoNames}
                    className="btn btn-secondary btn-sm"
                    disabled={loadingGeoNames || !codigoISO}
                    title="Buscar dados do país pelo código ISO"
                  >
                    {loadingGeoNames ? '⏳' : '🌐'} Buscar por ISO
                  </button>
                </div>
                <small className="form-hint">
                  Código de 2 letras (ex: BR, US, PT)
                </small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="continenteId" className="form-label">
                  Continente *
                </label>
                <select
                  id="continenteId"
                  className="form-select"
                  value={continenteId}
                  onChange={(e) => setContinenteId(Number(e.target.value))}
                  required
                >
                  <option value="">Selecione um continente</option>
                  {continentes.map((cont) => (
                    <option key={cont.id} value={cont.id}>
                      {cont.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="capital" className="form-label">
                  Capital
                </label>
                <input
                  id="capital"
                  type="text"
                  className="form-input"
                  value={capital}
                  onChange={(e) => setCapital(e.target.value)}
                  placeholder="Ex: Brasília"
                />
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
                  placeholder="Ex: 213000000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="idioma" className="form-label">
                  Idioma Principal
                </label>
                <input
                  id="idioma"
                  type="text"
                  className="form-input"
                  value={idioma}
                  onChange={(e) => setIdioma(e.target.value)}
                  placeholder="Ex: Português"
                />
              </div>

              <div className="form-group">
                <label htmlFor="moeda" className="form-label">
                  Moeda
                </label>
                <input
                  id="moeda"
                  type="text"
                  className="form-input"
                  value={moeda}
                  onChange={(e) => setMoeda(e.target.value)}
                  placeholder="Ex: Real (BRL)"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/paises')}
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
