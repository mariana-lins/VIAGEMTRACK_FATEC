# 📡 Documentação da API - ViagemTrack

Referência completa da API REST do ViagemTrack.

## 📋 Sumário

- [Informações Gerais](#informações-gerais)
- [Autenticação](#autenticação)
- [Continentes](#continentes)
- [Países](#países)
- [Cidades](#cidades)
- [Usuários](#usuários)
- [Visitas](#visitas)
- [APIs Externas](#apis-externas)
- [Códigos de Status](#códigos-de-status)
- [Tratamento de Erros](#tratamento-de-erros)

---

## Informações Gerais

### Base URL

```
http://localhost:3000
```

### Content-Type

Todas as requisições e respostas usam JSON:

```http
Content-Type: application/json
```

### Paginação

Endpoints que retornam listas suportam paginação:

**Query Parameters:**
- `page` (number, default: 1) - Página atual
- `limit` (number, default: 20) - Itens por página

**Resposta:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Headers Comuns

**Requisições Autenticadas:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Autenticação

### Registrar Usuário

Cria uma nova conta de usuário.

```http
POST /api/usuarios/registrar
```

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta:** `201 Created`
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

**Erros:**
- `400` - Dados inválidos ou email já cadastrado

---

### Login

Autentica um usuário e retorna token JWT.

```http
POST /api/usuarios/login
```

**Body:**
```json
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "_count": {
      "visitas": 4
    }
  }
}
```

**Erros:**
- `400` - Email ou senha inválidos
- `401` - Credenciais incorretas

---

### Perfil do Usuário

Obtém dados do usuário autenticado.

```http
GET /api/usuarios/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Resposta:** `200 OK`
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "_count": {
    "visitas": 4
  }
}
```

**Erros:**
- `401` - Token inválido ou expirado
- `404` - Usuário não encontrado

---

## Continentes

### Listar Continentes

```http
GET /api/continentes
```

**Query Parameters:**
- `page` (opcional) - Página (padrão: 1)
- `limit` (opcional) - Itens por página (padrão: 20)

**Resposta:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "nome": "América do Sul",
      "descricao": "Continente localizado no hemisfério sul...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "paises": 12
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 6,
    "totalPages": 1
  }
}
```

---

### Buscar Continente por ID

```http
GET /api/continentes/:id
```

**Resposta:** `200 OK`
```json
{
  "id": 1,
  "nome": "América do Sul",
  "descricao": "Continente localizado no hemisfério sul...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "_count": {
    "paises": 12
  }
}
```

**Erros:**
- `404` - Continente não encontrado

---

### Criar Continente

```http
POST /api/continentes
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Body:**
```json
{
  "nome": "Antártida",
  "descricao": "Continente gelado no polo sul"
}
```

**Resposta:** `201 Created`
```json
{
  "id": 7,
  "nome": "Antártida",
  "descricao": "Continente gelado no polo sul",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

**Erros:**
- `400` - Nome já existe ou dados inválidos
- `401` - Não autenticado

---

### Atualizar Continente

```http
PUT /api/continentes/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Body:**
```json
{
  "nome": "Antártida",
  "descricao": "Descrição atualizada"
}
```

**Resposta:** `200 OK`
```json
{
  "id": 7,
  "nome": "Antártida",
  "descricao": "Descrição atualizada",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

**Erros:**
- `400` - Dados inválidos
- `401` - Não autenticado
- `404` - Continente não encontrado

---

### Deletar Continente

```http
DELETE /api/continentes/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Resposta:** `204 No Content`

**Erros:**
- `401` - Não autenticado
- `404` - Continente não encontrado
- `409` - Continente possui países associados

---

## Países

### Listar Países

```http
GET /api/paises
```

**Query Parameters:**
- `page` (opcional) - Página
- `limit` (opcional) - Itens por página
- `continenteId` (opcional) - Filtrar por continente

**Exemplo:**
```http
GET /api/paises?continenteId=1&page=1&limit=10
```

**Resposta:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "nome": "Brasil",
      "codigoISO": "BR",
      "capital": "Brasília",
      "populacao": "214000000",
      "idioma": "Português",
      "moeda": "Real",
      "continenteId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "continente": {
        "id": 1,
        "nome": "América do Sul"
      },
      "_count": {
        "cidades": 5
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "totalPages": 2
  }
}
```

---

### Listar Países por Continente

```http
GET /api/paises/continente/:continenteId
```

**Resposta:** `200 OK`
```json
[
  {
    "id": 1,
    "nome": "Brasil",
    "codigoISO": "BR",
    "capital": "Brasília",
    "populacao": "214000000",
    "continenteId": 1
  },
  {
    "id": 2,
    "nome": "Argentina",
    "codigoISO": "AR",
    "capital": "Buenos Aires",
    "populacao": "45000000",
    "continenteId": 1
  }
]
```

---

### Buscar País por ID

```http
GET /api/paises/:id
```

**Resposta:** `200 OK`
```json
{
  "id": 1,
  "nome": "Brasil",
  "codigoISO": "BR",
  "capital": "Brasília",
  "populacao": "214000000",
  "idioma": "Português",
  "moeda": "Real",
  "continenteId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "continente": {
    "id": 1,
    "nome": "América do Sul",
    "descricao": "..."
  },
  "_count": {
    "cidades": 5
  }
}
```

**Erros:**
- `404` - País não encontrado

---

### Criar País

```http
POST /api/paises
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Body:**
```json
{
  "nome": "Uruguai",
  "codigoISO": "UY",
  "capital": "Montevidéu",
  "populacao": 3500000,
  "idioma": "Espanhol",
  "moeda": "Peso uruguaio",
  "continenteId": 1
}
```

**Resposta:** `201 Created`
```json
{
  "id": 13,
  "nome": "Uruguai",
  "codigoISO": "UY",
  "capital": "Montevidéu",
  "populacao": "3500000",
  "idioma": "Espanhol",
  "moeda": "Peso uruguaio",
  "continenteId": 1,
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

**Erros:**
- `400` - Dados inválidos ou código ISO já existe
- `401` - Não autenticado

---

### Atualizar País

```http
PUT /api/paises/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Body:**
```json
{
  "nome": "Uruguai",
  "capital": "Montevideo",
  "populacao": 3600000
}
```

**Resposta:** `200 OK`

**Erros:**
- `400` - Dados inválidos
- `401` - Não autenticado
- `404` - País não encontrado

---

### Deletar País

```http
DELETE /api/paises/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Resposta:** `204 No Content`

**Erros:**
- `401` - Não autenticado
- `404` - País não encontrado
- `409` - País possui cidades associadas

---

## Cidades

### Listar Cidades

```http
GET /api/cidades
```

**Query Parameters:**
- `page` (opcional)
- `limit` (opcional)
- `paisId` (opcional) - Filtrar por país

**Resposta:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "nome": "São Paulo",
      "populacao": 12000000,
      "latitude": -23.5505,
      "longitude": -46.6333,
      "clima": "Subtropical",
      "paisId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "pais": {
        "id": 1,
        "nome": "Brasil",
        "codigoISO": "BR"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

### Listar Cidades por País

```http
GET /api/cidades/pais/:paisId
```

**Resposta:** `200 OK`
```json
[
  {
    "id": 1,
    "nome": "São Paulo",
    "populacao": 12000000,
    "latitude": -23.5505,
    "longitude": -46.6333,
    "paisId": 1
  },
  {
    "id": 2,
    "nome": "Rio de Janeiro",
    "populacao": 6700000,
    "latitude": -22.9068,
    "longitude": -43.1729,
    "paisId": 1
  }
]
```

---

### Buscar Cidade por ID

```http
GET /api/cidades/:id
```

**Resposta:** `200 OK`
```json
{
  "id": 1,
  "nome": "São Paulo",
  "populacao": 12000000,
  "latitude": -23.5505,
  "longitude": -46.6333,
  "clima": "Subtropical",
  "paisId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "pais": {
    "id": 1,
    "nome": "Brasil",
    "codigoISO": "BR",
    "capital": "Brasília",
    "continente": {
      "id": 1,
      "nome": "América do Sul"
    }
  }
}
```

**Erros:**
- `404` - Cidade não encontrada

---

### Criar Cidade

```http
POST /api/cidades
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Body:**
```json
{
  "nome": "Campinas",
  "populacao": 1200000,
  "latitude": -22.9099,
  "longitude": -47.0626,
  "clima": "Tropical de altitude",
  "paisId": 1
}
```

**Resposta:** `201 Created`
```json
{
  "id": 51,
  "nome": "Campinas",
  "populacao": 1200000,
  "latitude": -22.9099,
  "longitude": -47.0626,
  "clima": "Tropical de altitude",
  "paisId": 1,
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

**Erros:**
- `400` - Dados inválidos
- `401` - Não autenticado

---

### Atualizar Cidade

```http
PUT /api/cidades/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Body:**
```json
{
  "nome": "Campinas",
  "populacao": 1300000,
  "clima": "Tropical"
}
```

**Resposta:** `200 OK`

**Erros:**
- `400` - Dados inválidos
- `401` - Não autenticado
- `404` - Cidade não encontrada

---

### Deletar Cidade

```http
DELETE /api/cidades/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Resposta:** `204 No Content`

**Erros:**
- `401` - Não autenticado
- `404` - Cidade não encontrada

---

## Usuários

### Listar Usuários

```http
GET /api/usuarios
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Resposta:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@example.com",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "_count": {
        "visitas": 4
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

**Erros:**
- `401` - Não autenticado

---

### Atualizar Usuário

```http
PUT /api/usuarios/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Body:**
```json
{
  "nome": "João da Silva",
  "email": "joao.silva@example.com"
}
```

**Resposta:** `200 OK`
```json
{
  "id": 1,
  "nome": "João da Silva",
  "email": "joao.silva@example.com",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

**Erros:**
- `400` - Email já em uso
- `401` - Não autenticado
- `404` - Usuário não encontrado

---

### Deletar Usuário

```http
DELETE /api/usuarios/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Resposta:** `204 No Content`

**Erros:**
- `401` - Não autenticado
- `404` - Usuário não encontrado

---

## Visitas

### Listar Visitas do Usuário

```http
GET /api/visitas/usuario/:usuarioId
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Resposta:** `200 OK`
```json
[
  {
    "id": 1,
    "dataVisita": "2024-01-10T00:00:00.000Z",
    "comentario": "Viagem incrível!",
    "cidadeId": 1,
    "usuarioId": 1,
    "createdAt": "2024-01-10T12:00:00.000Z",
    "cidade": {
      "id": 1,
      "nome": "São Paulo",
      "pais": {
        "id": 1,
        "nome": "Brasil",
        "codigoISO": "BR"
      }
    }
  }
]
```

**Erros:**
- `401` - Não autenticado

---

### Buscar Visita por ID

```http
GET /api/visitas/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Resposta:** `200 OK`
```json
{
  "id": 1,
  "dataVisita": "2024-01-10T00:00:00.000Z",
  "comentario": "Viagem incrível!",
  "cidadeId": 1,
  "usuarioId": 1,
  "createdAt": "2024-01-10T12:00:00.000Z",
  "cidade": {
    "id": 1,
    "nome": "São Paulo",
    "latitude": -23.5505,
    "longitude": -46.6333,
    "pais": {
      "nome": "Brasil",
      "codigoISO": "BR"
    }
  }
}
```

**Erros:**
- `401` - Não autenticado
- `404` - Visita não encontrada

---

### Marcar Cidade como Visitada

```http
POST /api/visitas
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Body:**
```json
{
  "cidadeId": 1,
  "dataVisita": "2024-01-10",
  "comentario": "Experiência maravilhosa"
}
```

**Resposta:** `201 Created`
```json
{
  "id": 5,
  "dataVisita": "2024-01-10T00:00:00.000Z",
  "comentario": "Experiência maravilhosa",
  "cidadeId": 1,
  "usuarioId": 1,
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

**Erros:**
- `400` - Cidade já visitada ou dados inválidos
- `401` - Não autenticado

---

### Atualizar Visita

```http
PUT /api/visitas/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Body:**
```json
{
  "dataVisita": "2024-01-12",
  "comentario": "Comentário atualizado"
}
```

**Resposta:** `200 OK`

**Erros:**
- `400` - Dados inválidos
- `401` - Não autenticado
- `404` - Visita não encontrada

---

### Deletar Visita

```http
DELETE /api/visitas/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Resposta:** `204 No Content`

**Erros:**
- `401` - Não autenticado
- `404` - Visita não encontrada

---

## APIs Externas

### Buscar Dados de País (GeoNames)

```http
GET /api/external/geonames/pais/:codigo
```

**Parâmetros:**
- `codigo` - Código ISO de 2 letras (ex: BR, US, FR)

**Resposta:** `200 OK`
```json
{
  "countryCode": "BR",
  "countryName": "Brazil",
  "capital": "Brasília",
  "population": 214000000,
  "languages": "pt-BR,es,en,fr",
  "currencyCode": "BRL"
}
```

**Erros:**
- `400` - Código ISO inválido
- `404` - País não encontrado no GeoNames

---

### Buscar País por Nome (GeoNames)

```http
GET /api/external/geonames/pais-por-nome?nome=Brazil
```

**Query Parameters:**
- `nome` - Nome do país (funciona em português ou inglês)

**Resposta:** `200 OK`
```json
{
  "countryCode": "BR",
  "countryName": "Brazil",
  "capital": "Brasília",
  "population": 214000000,
  "languages": "pt-BR,es,en,fr",
  "currencyCode": "BRL"
}
```

**Erros:**
- `400` - Nome não fornecido
- `404` - País não encontrado

---

### Buscar Cidade (GeoNames)

```http
GET /api/external/geonames/cidades?nome=São Paulo&maxRows=10
```

**Query Parameters:**
- `nome` - Nome da cidade
- `maxRows` (opcional) - Máximo de resultados (padrão: 10)

**Resposta:** `200 OK`
```json
{
  "geonames": [
    {
      "name": "São Paulo",
      "countryCode": "BR",
      "countryName": "Brazil",
      "lat": "-23.5475",
      "lng": "-46.63611",
      "population": 12400000,
      "adminName1": "São Paulo"
    }
  ]
}
```

**Erros:**
- `400` - Nome não fornecido
- `404` - Nenhuma cidade encontrada

---

### Buscar Clima (WeatherAPI)

```http
GET /api/external/weather/current?cidade=São Paulo
```

**Query Parameters:**
- `cidade` - Nome da cidade

**Resposta:** `200 OK`
```json
{
  "location": {
    "name": "Sao Paulo",
    "country": "Brazil",
    "localtime": "2024-01-15 10:30"
  },
  "current": {
    "temp_c": 25,
    "condition": {
      "text": "Partly cloudy"
    },
    "humidity": 70,
    "wind_kph": 15
  }
}
```

**Erros:**
- `400` - Nome não fornecido
- `500` - Erro na API externa

---

## Códigos de Status

### Sucesso

| Código | Descrição |
|--------|-----------|
| `200 OK` | Requisição bem-sucedida |
| `201 Created` | Recurso criado com sucesso |
| `204 No Content` | Recurso deletado com sucesso |

### Erros do Cliente

| Código | Descrição |
|--------|-----------|
| `400 Bad Request` | Dados inválidos ou malformados |
| `401 Unauthorized` | Não autenticado ou token inválido |
| `403 Forbidden` | Sem permissão para acessar recurso |
| `404 Not Found` | Recurso não encontrado |
| `409 Conflict` | Conflito (ex: email já cadastrado) |

### Erros do Servidor

| Código | Descrição |
|--------|-----------|
| `500 Internal Server Error` | Erro interno do servidor |
| `502 Bad Gateway` | Erro na API externa |
| `503 Service Unavailable` | Serviço temporariamente indisponível |

---

## Tratamento de Erros

### Formato Padrão de Erro

```json
{
  "error": "Mensagem de erro descritiva"
}
```

### Exemplos

**400 - Dados Inválidos:**
```json
{
  "error": "Email já cadastrado"
}
```

**401 - Não Autenticado:**
```json
{
  "error": "Token não fornecido"
}
```

**404 - Não Encontrado:**
```json
{
  "error": "País não encontrado"
}
```

**500 - Erro Interno:**
```json
{
  "error": "Erro ao processar requisição"
}
```

### Validações Comuns

**Email inválido:**
```json
{
  "error": "Email inválido"
}
```

**Campo obrigatório:**
```json
{
  "error": "Nome é obrigatório"
}
```

**Valor único já existe:**
```json
{
  "error": "Código ISO já cadastrado"
}
```

**Recurso com dependências:**
```json
{
  "error": "Não é possível deletar país com cidades associadas"
}
```

---

## Exemplos de Uso

### Exemplo Completo - Criar País

**1. Fazer Login:**
```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "senha123"
  }'
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": { "id": 1, "nome": "João" }
}
```

**2. Criar País:**
```bash
curl -X POST http://localhost:3000/api/paises \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "nome": "Portugal",
    "codigoISO": "PT",
    "capital": "Lisboa",
    "continenteId": 3
  }'
```

**Resposta:**
```json
{
  "id": 14,
  "nome": "Portugal",
  "codigoISO": "PT",
  "capital": "Lisboa",
  "continenteId": 3,
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

---

### Exemplo - Buscar com Paginação

```bash
curl "http://localhost:3000/api/cidades?page=2&limit=5&paisId=1"
```

**Resposta:**
```json
{
  "data": [
    { "id": 6, "nome": "Salvador" },
    { "id": 7, "nome": "Fortaleza" },
    { "id": 8, "nome": "Belo Horizonte" },
    { "id": 9, "nome": "Manaus" },
    { "id": 10, "nome": "Curitiba" }
  ],
  "pagination": {
    "page": 2,
    "limit": 5,
    "total": 15,
    "totalPages": 3
  }
}
```

---

### Exemplo - Integração GeoNames

**Buscar país por nome:**
```bash
curl "http://localhost:3000/api/external/geonames/pais-por-nome?nome=Brazil"
```

**Buscar cidades:**
```bash
curl "http://localhost:3000/api/external/geonames/cidades?nome=Tokyo&maxRows=5"
```

---
