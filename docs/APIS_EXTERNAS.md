# 🌐 APIs Externas - ViagemTrack

Documentação completa das integrações com APIs externas.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [GeoNames API](#geonames-api)
- [WeatherAPI](#weatherapi)
- [Flagpedia](#flagpedia)
- [Configuração](#configuração)
- [Implementação](#implementação)
- [Tratamento de Erros](#tratamento-de-erros)
- [Boas Práticas](#boas-práticas)

---

## Visão Geral

O ViagemTrack integra-se com três APIs externas para enriquecer os dados de países, cidades e fornecer informações adicionais:

| API | Propósito | Status | Requer Autenticação |
|-----|-----------|--------|---------------------|
| **GeoNames** | Dados geográficos (países, cidades, coordenadas) | ✅ Implementado | Sim (gratuito) |
| **WeatherAPI** | Informações climáticas em tempo real | ✅ Implementado | Sim (gratuito) |
| **Flagpedia** | Bandeiras de países | ✅ Implementado | Não |

### Fluxo de Integração

```
┌─────────────┐
│   Frontend  │
│   (React)   │
└──────┬──────┘
       │
       │ HTTP Request
       ▼
┌─────────────┐
│   Backend   │
│  (Express)  │
└──────┬──────┘
       │
       │ Axios
       ▼
┌─────────────────────────┐
│    External APIs        │
│  • GeoNames             │
│  • WeatherAPI           │
│  • Flagpedia            │
└─────────────────────────┘
```

---

## GeoNames API

### Sobre

GeoNames é uma base de dados geográfica gratuita que cobre todos os países e contém mais de 11 milhões de nomes de lugares.

**Site:** https://www.geonames.org/  
**Documentação:** https://www.geonames.org/export/web-services.html  
**Planos:** Gratuito (com registro), Premium (pagos)

### Recursos Utilizados

#### 1. Country Info (Informações de Países)

**Endpoint:** `http://api.geonames.org/countryInfoJSON`

**Propósito:** Obter dados completos de países (nome, capital, população, idiomas, moeda)

**Parâmetros:**
- `username` (obrigatório) - Seu username do GeoNames
- `country` (opcional) - Código ISO de 2 letras
- `lang` (opcional) - Idioma da resposta (pt, en, es...)

**Exemplo de Uso:**
```http
GET http://api.geonames.org/countryInfoJSON?country=BR&username=demo&lang=pt
```

**Resposta:**
```json
{
  "geonames": [
    {
      "continent": "SA",
      "capital": "Brasília",
      "languages": "pt-BR,es,en,fr",
      "geonameId": 3469034,
      "south": -33.75118,
      "isoAlpha3": "BRA",
      "north": 5.27438888,
      "fipsCode": "BR",
      "population": "214000000",
      "east": -28.6341164,
      "isoNumeric": "076",
      "areaInSqKm": "8547400.0",
      "countryCode": "BR",
      "west": -73.98281363,
      "countryName": "Brazil",
      "continentName": "South America",
      "currencyCode": "BRL"
    }
  ]
}
```

**Campos Importantes:**
- `countryCode` - Código ISO (BR)
- `countryName` - Nome em inglês
- `capital` - Capital
- `population` - População
- `languages` - Idiomas
- `currencyCode` - Código da moeda

---

#### 2. Search Cities (Busca de Cidades)

**Endpoint:** `http://api.geonames.org/searchJSON`

**Propósito:** Buscar cidades por nome

**Parâmetros:**
- `username` (obrigatório)
- `name` (obrigatório) - Nome da cidade
- `maxRows` (opcional) - Número máximo de resultados (padrão: 10)
- `featureClass` (opcional) - Filtrar por tipo (P = cidades)
- `orderby` (opcional) - Ordenação (population, relevance)

**Exemplo de Uso:**
```http
GET http://api.geonames.org/searchJSON?name=Tokyo&maxRows=5&username=demo&featureClass=P&orderby=population
```

**Resposta:**
```json
{
  "totalResultsCount": 247,
  "geonames": [
    {
      "adminCode1": "40",
      "lng": "139.69167",
      "geonameId": 1850144,
      "toponymName": "Tokyo",
      "countryId": "1861060",
      "fcl": "P",
      "population": 8336599,
      "countryCode": "JP",
      "name": "Tokyo",
      "fclName": "city, village,...",
      "adminName1": "Tokyo",
      "lat": "35.6895",
      "fcode": "PPLC",
      "countryName": "Japan"
    }
  ]
}
```

**Campos Importantes:**
- `name` - Nome da cidade
- `lat` - Latitude
- `lng` - Longitude
- `population` - População
- `countryCode` - País (código ISO)
- `countryName` - Nome do país

---

### Implementação Backend

**Arquivo:** `backend/src/services/geonames.service.ts`

```typescript
import axios from 'axios';

const GEONAMES_BASE_URL = 'http://api.geonames.org';
const username = process.env.GEONAMES_USERNAME || 'demo';

export class GeoNamesService {
  /**
   * Busca país por código ISO
   */
  static async buscarPaisPorCodigo(codigo: string) {
    try {
      const response = await axios.get(`${GEONAMES_BASE_URL}/countryInfoJSON`, {
        params: {
          country: codigo.toUpperCase(),
          username,
          lang: 'pt'
        }
      });

      const paises = response.data.geonames || [];
      if (paises.length === 0) {
        return null;
      }

      return paises[0];
    } catch (error) {
      console.error('Erro ao buscar país no GeoNames:', error);
      throw new Error('Erro ao buscar país no GeoNames');
    }
  }

  /**
   * Busca país por nome (inteligente)
   * Suporta português e inglês
   */
  static async buscarPaisPorNome(nome: string) {
    try {
      const response = await axios.get(`${GEONAMES_BASE_URL}/countryInfoJSON`, {
        params: { username }
      });

      const paises = response.data.geonames || [];
      const nomeLower = nome.toLowerCase().trim();

      // Algoritmo de busca em 4 níveis:
      
      // 1. Match exato (case insensitive)
      let pais = paises.find(p => 
        p.countryName.toLowerCase() === nomeLower
      );
      if (pais) return pais;

      // 2. Começa com o termo
      pais = paises.find(p => 
        p.countryName.toLowerCase().startsWith(nomeLower)
      );
      if (pais) return pais;

      // 3. Match em palavras individuais
      pais = paises.find(p => 
        p.countryName.toLowerCase().split(' ').includes(nomeLower)
      );
      if (pais) return pais;

      // 4. Match parcial (pelo menos 3 caracteres)
      if (nomeLower.length >= 3) {
        pais = paises.find(p => 
          p.countryName.toLowerCase().includes(nomeLower)
        );
        if (pais) return pais;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar país por nome:', error);
      throw new Error('Erro ao buscar país por nome');
    }
  }

  /**
   * Busca cidades por nome
   */
  static async buscarCidades(nome: string, maxRows: number = 10) {
    try {
      const response = await axios.get(`${GEONAMES_BASE_URL}/searchJSON`, {
        params: {
          name: nome,
          maxRows,
          username,
          featureClass: 'P', // P = cidades/lugares populados
          orderby: 'population' // Ordenar por população
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cidades no GeoNames:', error);
      throw new Error('Erro ao buscar cidades no GeoNames');
    }
  }
}
```

### Rotas Backend

**Arquivo:** `backend/src/routes/external.routes.ts`

```typescript
import { Router } from 'express';
import { GeoNamesService } from '../services/geonames.service';

const router = Router();

// Buscar país por código ISO
router.get('/geonames/pais/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    
    if (!codigo || codigo.length !== 2) {
      return res.status(400).json({ 
        error: 'Código ISO deve ter 2 caracteres' 
      });
    }

    const pais = await GeoNamesService.buscarPaisPorCodigo(codigo);
    
    if (!pais) {
      return res.status(404).json({ 
        error: 'País não encontrado no GeoNames' 
      });
    }

    res.json(pais);
  } catch (error) {
    console.error('Erro ao buscar país:', error);
    res.status(500).json({ error: 'Erro ao buscar país no GeoNames' });
  }
});

// Buscar país por nome
router.get('/geonames/pais-por-nome', async (req, res) => {
  try {
    const { nome } = req.query;
    
    if (!nome || typeof nome !== 'string') {
      return res.status(400).json({ 
        error: 'Nome do país é obrigatório' 
      });
    }

    const pais = await GeoNamesService.buscarPaisPorNome(nome);
    
    if (!pais) {
      return res.status(404).json({ 
        error: 'País não encontrado. Tente usar o nome em inglês.' 
      });
    }

    res.json(pais);
  } catch (error) {
    console.error('Erro ao buscar país por nome:', error);
    res.status(500).json({ error: 'Erro ao buscar país' });
  }
});

// Buscar cidades
router.get('/geonames/cidades', async (req, res) => {
  try {
    const { nome, maxRows } = req.query;
    
    if (!nome || typeof nome !== 'string') {
      return res.status(400).json({ 
        error: 'Nome da cidade é obrigatório' 
      });
    }

    const max = maxRows ? parseInt(maxRows as string) : 10;
    const resultado = await GeoNamesService.buscarCidades(nome, max);

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    res.status(500).json({ error: 'Erro ao buscar cidades' });
  }
});

export default router;
```

### Integração Frontend

**Arquivo:** `frontend/src/services/api.ts`

```typescript
export const externalAPI = {
  buscarPaisPorCodigo: (codigo: string) =>
    api.get(`/api/external/geonames/pais/${codigo}`),
  
  buscarPaisPorNome: (nome: string) =>
    api.get(`/api/external/geonames/pais-por-nome`, { 
      params: { nome } 
    }),
  
  buscarCidades: (nome: string, maxRows = 10) =>
    api.get(`/api/external/geonames/cidades`, { 
      params: { nome, maxRows } 
    }),
};
```

**Exemplo de Uso em Componente:**

```typescript
// FormPais.tsx
const buscarDadosPorNome = async () => {
  if (!paisData.nome) {
    alert('Digite o nome do país');
    return;
  }

  try {
    setLoading(true);
    const response = await externalAPI.buscarPaisPorNome(paisData.nome);
    const data = response.data;

    setPaisData({
      ...paisData,
      codigoISO: data.countryCode,
      capital: data.capital,
      populacao: data.population,
      idioma: data.languages?.split(',')[0],
      moeda: data.currencyCode
    });

    alert(`Dados encontrados para ${data.countryName}!`);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    alert('País não encontrado. Tente usar o nome em inglês.');
  } finally {
    setLoading(false);
  }
};
```

### Limitações e Considerações

**Conta Gratuita:**
- ✅ 20.000 requisições/dia
- ✅ Todos os web services disponíveis
- ❌ Rate limit mais baixo

**Conta Premium:**
- ✅ Sem limite de requisições
- ✅ Rate limit maior
- ✅ Suporte prioritário

**Dicas:**
- Use nomes em **inglês** para melhores resultados
- Cache resultados para evitar requisições repetidas
- Implemente retry logic para falhas temporárias
- Monitore sua cota de uso

---

## WeatherAPI

### Sobre

WeatherAPI fornece dados climáticos em tempo real, previsões e informações históricas.

**Site:** https://www.weatherapi.com/  
**Documentação:** https://www.weatherapi.com/docs/  
**Planos:** Gratuito (1M calls/mês), Pro (pagos)

### Recursos Utilizados

#### Current Weather (Clima Atual)

**Endpoint:** `http://api.weatherapi.com/v1/current.json`

**Propósito:** Obter clima atual de uma cidade

**Parâmetros:**
- `key` (obrigatório) - Sua API key
- `q` (obrigatório) - Nome da cidade ou coordenadas
- `lang` (opcional) - Idioma (pt, en...)

**Exemplo de Uso:**
```http
GET http://api.weatherapi.com/v1/current.json?key=YOUR_KEY&q=São Paulo&lang=pt
```

**Resposta:**
```json
{
  "location": {
    "name": "Sao Paulo",
    "region": "Sao Paulo",
    "country": "Brazil",
    "lat": -23.53,
    "lon": -46.62,
    "tz_id": "America/Sao_Paulo",
    "localtime": "2024-01-15 10:30"
  },
  "current": {
    "last_updated": "2024-01-15 10:15",
    "temp_c": 25.0,
    "temp_f": 77.0,
    "is_day": 1,
    "condition": {
      "text": "Parcialmente nublado",
      "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
      "code": 1003
    },
    "wind_mph": 9.4,
    "wind_kph": 15.1,
    "wind_degree": 180,
    "wind_dir": "S",
    "pressure_mb": 1013.0,
    "precip_mm": 0.0,
    "humidity": 70,
    "cloud": 50,
    "feelslike_c": 27.0,
    "vis_km": 10.0,
    "uv": 6.0
  }
}
```

**Campos Importantes:**
- `location.name` - Nome da cidade
- `location.country` - País
- `current.temp_c` - Temperatura em Celsius
- `current.condition.text` - Descrição do clima
- `current.condition.icon` - URL do ícone
- `current.humidity` - Umidade
- `current.wind_kph` - Velocidade do vento

---

### Implementação Backend

**Arquivo:** `backend/src/services/weather.service.ts`

```typescript
import axios from 'axios';

const WEATHER_API_BASE_URL = 'http://api.weatherapi.com/v1';
const apiKey = process.env.WEATHER_API_KEY;

export class WeatherService {
  /**
   * Busca clima atual de uma cidade
   */
  static async buscarClimaAtual(cidade: string) {
    if (!apiKey) {
      throw new Error('WEATHER_API_KEY não configurada');
    }

    try {
      const response = await axios.get(`${WEATHER_API_BASE_URL}/current.json`, {
        params: {
          key: apiKey,
          q: cidade,
          lang: 'pt'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar clima:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Cidade não encontrada');
      }
      
      throw new Error('Erro ao buscar clima');
    }
  }

  /**
   * Busca clima por coordenadas
   */
  static async buscarClimaPorCoordenadas(lat: number, lng: number) {
    if (!apiKey) {
      throw new Error('WEATHER_API_KEY não configurada');
    }

    try {
      const response = await axios.get(`${WEATHER_API_BASE_URL}/current.json`, {
        params: {
          key: apiKey,
          q: `${lat},${lng}`,
          lang: 'pt'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar clima por coordenadas:', error);
      throw new Error('Erro ao buscar clima');
    }
  }
}
```

### Rotas Backend

```typescript
// external.routes.ts
router.get('/weather/current', async (req, res) => {
  try {
    const { cidade } = req.query;
    
    if (!cidade || typeof cidade !== 'string') {
      return res.status(400).json({ 
        error: 'Nome da cidade é obrigatório' 
      });
    }

    const clima = await WeatherService.buscarClimaAtual(cidade);
    res.json(clima);
  } catch (error: any) {
    console.error('Erro ao buscar clima:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### Integração Frontend

```typescript
// api.ts
export const externalAPI = {
  buscarClimaAtual: (cidade: string) =>
    api.get(`/api/external/weather/current`, { 
      params: { cidade } 
    }),
};

// Uso em componente
const buscarClima = async () => {
  try {
    const response = await externalAPI.buscarClimaAtual('São Paulo');
    const { current } = response.data;
    
    console.log(`Temperatura: ${current.temp_c}°C`);
    console.log(`Condição: ${current.condition.text}`);
  } catch (error) {
    console.error('Erro ao buscar clima:', error);
  }
};
```

---

## Flagpedia

### Sobre

Flagpedia é uma API simples e gratuita para obter bandeiras de países.

**Site:** https://flagpedia.net/  
**Formato:** Imagens SVG/PNG  
**Autenticação:** Não requerida

### Uso

**Padrão de URL:**
```
https://flagcdn.com/{tamanho}/{codigo}.{formato}
```

**Tamanhos Disponíveis:**
- `w20` - 20px de largura
- `w40` - 40px
- `w80` - 80px
- `w160` - 160px
- `w320` - 320px
- `w640` - 640px
- `w1280` - 1280px

**Formatos:**
- `svg` - Vetor (melhor qualidade)
- `png` - Raster

**Exemplos:**
```html
<!-- Bandeira do Brasil (SVG, 80px) -->
<img src="https://flagcdn.com/w80/br.svg" alt="Brasil" />

<!-- Bandeira dos EUA (PNG, 160px) -->
<img src="https://flagcdn.com/w160/us.png" alt="USA" />

<!-- Bandeira da França (SVG, 320px) -->
<img src="https://flagcdn.com/w320/fr.svg" alt="França" />
```

### Implementação Frontend

**Helper Function:**

```typescript
// utils/flags.ts
export const getBandeiraUrl = (codigoISO: string, tamanho = 80): string => {
  if (!codigoISO) return '';
  return `https://flagcdn.com/w${tamanho}/${codigoISO.toLowerCase()}.svg`;
};
```

**Uso em Componente:**

```tsx
// ListaPaises.tsx
import { getBandeiraUrl } from '../../utils/flags';

function ListaPaises() {
  const [paises, setPaises] = useState<Pais[]>([]);

  return (
    <div className="paises-grid">
      {paises.map(pais => (
        <div key={pais.id} className="pais-card">
          {pais.codigoISO && (
            <img
              src={getBandeiraUrl(pais.codigoISO, 80)}
              alt={`Bandeira ${pais.nome}`}
              className="bandeira"
            />
          )}
          <h3>{pais.nome}</h3>
          <p>{pais.capital}</p>
        </div>
      ))}
    </div>
  );
}
```

**CSS:**

```css
.bandeira {
  width: 80px;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}
```

---

## Configuração

### Variáveis de Ambiente

**Arquivo:** `backend/.env`

```env
# GeoNames API
GEONAMES_USERNAME=seu_username_aqui

# WeatherAPI
WEATHER_API_KEY=sua_key_aqui
```

### Obtendo Credenciais

#### GeoNames

1. Acesse https://www.geonames.org/login
2. Clique em "create a new user account"
3. Preencha o formulário de registro
4. Confirme seu email
5. Acesse "My Account" → "Enable Free Web Services"
6. Use seu username na variável `GEONAMES_USERNAME`

#### WeatherAPI

1. Acesse https://www.weatherapi.com/signup.aspx
2. Crie uma conta gratuita
3. Confirme seu email
4. Copie sua API key do dashboard
5. Cole na variável `WEATHER_API_KEY`

---

## Tratamento de Erros

### Estratégia Geral

```typescript
try {
  const response = await axios.get(url, { params });
  return response.data;
} catch (error: any) {
  // Log detalhado
  console.error('Erro na API externa:', {
    url,
    params,
    status: error.response?.status,
    message: error.message
  });

  // Erro específico ou genérico
  if (error.response?.status === 404) {
    throw new Error('Recurso não encontrado');
  } else if (error.response?.status === 401) {
    throw new Error('Credenciais inválidas');
  } else if (error.response?.status === 429) {
    throw new Error('Limite de requisições excedido');
  }
  
  throw new Error('Erro ao acessar API externa');
}
```

### Timeouts

```typescript
const response = await axios.get(url, {
  params,
  timeout: 5000 // 5 segundos
});
```

### Retry Logic

```typescript
import retry from 'axios-retry';

retry(axios, {
  retries: 3,
  retryDelay: retry.exponentialDelay,
  retryCondition: (error) => {
    return error.response?.status >= 500;
  }
});
```

---

## Boas Práticas

### 1. Caching

**Evitar requisições desnecessárias:**

```typescript
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hora

async function buscarComCache(key: string, fetchFn: () => Promise<any>) {
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await fetchFn();
  cache.set(key, { data, timestamp: Date.now() });
  
  return data;
}
```

### 2. Rate Limiting

**Controlar taxa de requisições:**

```typescript
import Bottleneck from 'bottleneck';

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 100 // 100ms entre requisições
});

const buscarPais = limiter.wrap(GeoNamesService.buscarPaisPorCodigo);
```

### 3. Monitoramento

**Registrar uso de APIs:**

```typescript
interface APIUsage {
  api: string;
  endpoint: string;
  timestamp: Date;
  success: boolean;
}

function logAPIUsage(usage: APIUsage) {
  // Salvar em banco ou arquivo de log
  console.log(`[API Usage] ${usage.api} - ${usage.endpoint} - ${usage.success}`);
}
```

### 4. Fallbacks

**Ter alternativas quando API falha:**

```typescript
async function buscarClima(cidade: string) {
  try {
    return await WeatherService.buscarClimaAtual(cidade);
  } catch (error) {
    console.error('Erro na API principal, tentando fallback');
    return {
      location: { name: cidade },
      current: { 
        temp_c: null, 
        condition: { text: 'Dados não disponíveis' } 
      }
    };
  }
}
```

### 5. Validação de Resposta

**Garantir formato esperado:**

```typescript
function validarRespostaPais(data: any): boolean {
  return (
    data &&
    typeof data.countryCode === 'string' &&
    typeof data.countryName === 'string'
  );
}

const response = await axios.get(url);
if (!validarRespostaPais(response.data)) {
  throw new Error('Resposta inválida da API');
}
```

---

## Exemplos Completos

### Exemplo 1: Auto-preenchimento de País

```typescript
// FormPais.tsx
const buscarDadosPorNome = async () => {
  if (!paisData.nome) {
    alert('Digite o nome do país');
    return;
  }

  try {
    setLoading(true);
    
    // Buscar no GeoNames
    const response = await externalAPI.buscarPaisPorNome(paisData.nome);
    const geoData = response.data;

    // Preencher formulário
    setPaisData({
      ...paisData,
      codigoISO: geoData.countryCode,
      capital: geoData.capital,
      populacao: geoData.population,
      idioma: geoData.languages?.split(',')[0],
      moeda: geoData.currencyCode
    });

    alert(`✓ Dados encontrados para ${geoData.countryName}`);
  } catch (error) {
    console.error('Erro:', error);
    alert('País não encontrado. Tente usar o nome em inglês.');
  } finally {
    setLoading(false);
  }
};
```

### Exemplo 2: Auto-preenchimento de Cidade

```typescript
// FormCidade.tsx
const buscarDadosCidade = async () => {
  if (!cidadeData.nome) {
    alert('Digite o nome da cidade');
    return;
  }

  try {
    setLoading(true);
    
    // Buscar no GeoNames
    const response = await externalAPI.buscarCidades(cidadeData.nome, 5);
    const cidades = response.data.geonames;

    if (cidades.length === 0) {
      alert('Cidade não encontrada');
      return;
    }

    // Primeira cidade (mais populosa)
    const cidade = cidades[0];

    // Preencher formulário
    setCidadeData({
      ...cidadeData,
      nome: cidade.name,
      latitude: parseFloat(cidade.lat),
      longitude: parseFloat(cidade.lng),
      populacao: cidade.population
    });

    // Tentar encontrar país correspondente
    try {
      const paisResponse = await paisesAPI.listar(1, 1000);
      const pais = paisResponse.data.data.find(
        p => p.codigoISO === cidade.countryCode
      );
      
      if (pais) {
        setCidadeData(prev => ({ ...prev, paisId: pais.id }));
      }
    } catch (error) {
      console.error('Erro ao buscar país:', error);
    }

    alert(`✓ Dados encontrados: ${cidade.name}, ${cidade.countryName}`);
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao buscar cidade');
  } finally {
    setLoading(false);
  }
};
```

### Exemplo 3: Exibir Clima na Página de Cidade

```typescript
// DetalhesCidade.tsx
const [clima, setClima] = useState<any>(null);

useEffect(() => {
  const carregarClima = async () => {
    if (!cidade.latitude || !cidade.longitude) return;
    
    try {
      const response = await externalAPI.buscarClimaAtual(cidade.nome);
      setClima(response.data);
    } catch (error) {
      console.error('Erro ao carregar clima:', error);
    }
  };

  carregarClima();
}, [cidade]);

return (
  <div>
    <h1>{cidade.nome}</h1>
    
    {clima && (
      <div className="clima-card">
        <h3>Clima Atual</h3>
        <img 
          src={`https:${clima.current.condition.icon}`} 
          alt={clima.current.condition.text}
        />
        <p>{clima.current.temp_c}°C</p>
        <p>{clima.current.condition.text}</p>
        <p>Umidade: {clima.current.humidity}%</p>
      </div>
    )}
  </div>
);
```

---