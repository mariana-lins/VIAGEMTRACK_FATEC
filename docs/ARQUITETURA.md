# 🏗️ Arquitetura do Sistema - ViagemTrack

Documentação técnica detalhada da arquitetura do sistema ViagemTrack.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitetura da Aplicação](#arquitetura-da-aplicação)
- [Modelo de Dados](#modelo-de-dados)
- [Backend](#backend)
- [Frontend](#frontend)
- [Segurança](#segurança)
- [Performance e Otimizações](#performance-e-otimizações)

---

## Visão Geral

ViagemTrack é uma aplicação web full-stack moderna construída com arquitetura cliente-servidor, seguindo os princípios REST e boas práticas de desenvolvimento.

### Características Principais

- **Arquitetura**: Cliente-Servidor (REST API)
- **Paradigma**: MVC (Model-View-Controller)
- **Tipo**: SPA (Single Page Application)
- **Autenticação**: JWT (JSON Web Tokens)
- **Banco de Dados**: Relacional (PostgreSQL)
- **ORM**: Prisma
- **Estilo de Código**: TypeScript (type-safe)

### Diagrama de Alto Nível

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│              │         │              │         │              │
│   Browser    │  HTTP   │   Backend    │   SQL   │  PostgreSQL  │
│   (React)    │ ◄─────► │  (Express)   │ ◄─────► │   Database   │
│              │  REST   │              │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │
       │                        │
       ▼                        ▼
   localhost:5173          localhost:3000
       │                        │
       │                        ▼
       │                 ┌──────────────┐
       │                 │   External   │
       │                 │     APIs     │
       └─────────────────┤   GeoNames   │
                         │  WeatherAPI  │
                         │  Flagpedia   │
                         └──────────────┘
```

---

## Stack Tecnológico

### Backend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **TypeScript** | 5.0+ | Type-safe JavaScript |
| **Express.js** | 4.18+ | Framework web |
| **Prisma** | 5.22.0 | ORM e migrations |
| **PostgreSQL** | 15+ | Banco de dados |
| **JWT** | 9.0+ | Autenticação |
| **Bcrypt** | 5.1+ | Hash de senhas |
| **Axios** | 1.6+ | Cliente HTTP |
| **CORS** | 2.8+ | Cross-Origin Resource Sharing |
| **Dotenv** | 16.3+ | Variáveis de ambiente |

### Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 18.3 | UI Library |
| **TypeScript** | 5.0+ | Type-safe JavaScript |
| **Vite** | 5.0+ | Build tool e dev server |
| **React Router** | 6.20+ | Roteamento SPA |
| **Axios** | 1.6+ | Cliente HTTP |
| **CSS Modules** | - | Estilos isolados |

### DevOps e Ferramentas

- **Git** - Controle de versão
- **npm** - Gerenciador de pacotes
- **ESLint** - Linter JavaScript/TypeScript
- **Prettier** - Formatação de código

---

## Arquitetura da Aplicação

### Padrão Arquitetural: MVC

```
┌─────────────────────────────────────────────────┐
│                    FRONTEND                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Pages   │  │Components│  │   Contexts   │  │
│  │  (View)  │◄─┤(UI Parts)│◄─┤ (State Mgmt) │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
│        │                                         │
│        │ HTTP Requests (Axios)                   │
└────────┼─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│                    BACKEND                      │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐    │
│  │  Routes  │─►│Controllers │─►│ Services │    │
│  │          │  │  (Logic)   │  │(External)│    │
│  └──────────┘  └────────────┘  └──────────┘    │
│                      │                           │
│                      ▼                           │
│              ┌────────────┐                      │
│              │   Prisma   │                      │
│              │   Client   │                      │
│              └────────────┘                      │
│                      │                           │
└──────────────────────┼───────────────────────────┘
                       │
                       ▼
                ┌─────────────┐
                │ PostgreSQL  │
                │  Database   │
                └─────────────┘
```

### Fluxo de Dados

**Exemplo: Listar Países**

1. **Usuário** acessa `/paises` no navegador
2. **React Router** renderiza componente `ListaPaises`
3. **ComponentDidMount** chama `paisesAPI.listar()`
4. **Axios** faz `GET http://localhost:3000/api/paises`
5. **Express Router** recebe requisição em `/api/paises`
6. **PaisController.listar()** é executado
7. **Prisma Client** consulta banco: `SELECT * FROM paises`
8. **PostgreSQL** retorna dados
9. **Controller** formata resposta (converte BigInt, adiciona paginação)
10. **Express** envia JSON com status 200
11. **Axios** recebe resposta
12. **React State** atualiza com dados
13. **Componente** re-renderiza mostrando países

---

## Modelo de Dados

### Diagrama ER (Entity-Relationship)

```
┌─────────────┐
│ Continente  │
│─────────────│
│ id          │◄────┐
│ nome        │     │
│ descricao   │     │
│ createdAt   │     │
└─────────────┘     │
                    │ 1:N
                    │
┌─────────────┐     │
│    Pais     │     │
│─────────────│     │
│ id          │─────┘
│ nome        │◄────┐
│ codigoISO   │     │
│ capital     │     │
│ populacao   │     │ 1:N
│ idioma      │     │
│ moeda       │     │
│ continenteId│     │
│ createdAt   │     │
└─────────────┘     │
                    │
┌─────────────┐     │
│   Cidade    │     │
│─────────────│     │
│ id          │─────┘
│ nome        │◄────┐
│ populacao   │     │
│ latitude    │     │
│ longitude   │     │ N:1
│ clima       │     │
│ paisId      │     │
│ createdAt   │     │
└─────────────┘     │
                    │
┌─────────────┐     │
│   Visita    │     │
│─────────────│     │
│ id          │─────┘
│ dataVisita  │
│ comentario  │─────┐
│ cidadeId    │     │
│ usuarioId   │─────┤
│ createdAt   │     │
└─────────────┘     │ 1:N
                    │
┌─────────────┐     │
│  Usuario    │     │
│─────────────│     │
│ id          │◄────┘
│ nome        │
│ email       │
│ senhaHash   │
│ createdAt   │
└─────────────┘
```

### Schema Prisma

**Arquivo:** `backend/prisma/schema.prisma`

```prisma
model Continente {
  id        Int      @id @default(autoincrement())
  nome      String   @unique
  descricao String?
  createdAt DateTime @default(now())
  
  paises    Pais[]
  
  @@map("continentes")
}

model Pais {
  id           Int      @id @default(autoincrement())
  nome         String
  codigoISO    String?  @unique @db.VarChar(2)
  capital      String?
  populacao    BigInt?
  idioma       String?
  moeda        String?
  continenteId Int
  createdAt    DateTime @default(now())
  
  continente   Continente @relation(fields: [continenteId], references: [id])
  cidades      Cidade[]
  
  @@map("paises")
}

model Cidade {
  id        Int      @id @default(autoincrement())
  nome      String
  populacao Int?
  latitude  Float?
  longitude Float?
  clima     String?
  paisId    Int
  createdAt DateTime @default(now())
  
  pais      Pais     @relation(fields: [paisId], references: [id])
  visitas   Visita[]
  
  @@map("cidades")
}

model Usuario {
  id        Int      @id @default(autoincrement())
  nome      String
  email     String   @unique
  senhaHash String
  createdAt DateTime @default(now())
  
  visitas   Visita[]
  
  @@map("usuarios")
}

model Visita {
  id         Int      @id @default(autoincrement())
  dataVisita DateTime @default(now())
  comentario String?
  cidadeId   Int
  usuarioId  Int
  createdAt  DateTime @default(now())
  
  cidade     Cidade   @relation(fields: [cidadeId], references: [id])
  usuario    Usuario  @relation(fields: [usuarioId], references: [id])
  
  @@unique([cidadeId, usuarioId])
  @@map("visitas")
}
```

### Tipos TypeScript

**Arquivo:** `frontend/src/types/index.ts`

```typescript
export interface Continente {
  id: number;
  nome: string;
  descricao?: string;
  createdAt: string;
  _count?: {
    paises: number;
  };
}

export interface Pais {
  id: number;
  nome: string;
  codigoISO?: string;
  capital?: string;
  populacao?: string; // BigInt convertido para string
  idioma?: string;
  moeda?: string;
  continenteId: number;
  createdAt: string;
  continente?: Continente;
  _count?: {
    cidades: number;
  };
}

export interface Cidade {
  id: number;
  nome: string;
  populacao?: number;
  latitude?: number;
  longitude?: number;
  clima?: string;
  paisId: number;
  createdAt: string;
  pais?: Pais;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  createdAt: string;
  _count?: {
    visitas: number;
  };
}

export interface Visita {
  id: number;
  dataVisita: string;
  comentario?: string;
  cidadeId: number;
  usuarioId: number;
  createdAt: string;
  cidade?: Cidade;
  usuario?: Usuario;
}
```

---

## Backend

### Estrutura de Pastas

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts       # Configuração Prisma Client
│   ├── controllers/
│   │   ├── continentes.controller.ts
│   │   ├── paises.controller.ts
│   │   ├── cidades.controller.ts
│   │   ├── usuarios.controller.ts
│   │   └── visitas.controller.ts
│   ├── routes/
│   │   ├── continentes.routes.ts
│   │   ├── paises.routes.ts
│   │   ├── cidades.routes.ts
│   │   ├── usuarios.routes.ts
│   │   ├── visitas.routes.ts
│   │   └── external.routes.ts
│   ├── services/
│   │   ├── geonames.service.ts
│   │   ├── weather.service.ts
│   │   └── flag.service.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   └── server.ts             # Entry point
├── prisma/
│   ├── schema.prisma         # Schema do banco
│   ├── seed.ts               # Dados iniciais
│   └── migrations/           # Histórico de migrations
├── .env                      # Variáveis de ambiente
├── .env.example              # Template de variáveis
├── package.json              # Dependências
└── tsconfig.json             # Configuração TypeScript
```

### Camada de Rotas

**Responsabilidade:** Definir endpoints HTTP e associá-los aos controllers

**Exemplo:** `backend/src/routes/paises.routes.ts`

```typescript
import { Router } from 'express';
import { PaisController } from '../controllers/paises.controller';

const router = Router();
const paisController = new PaisController();

// Rotas específicas primeiro (evitar conflito com /:id)
router.get('/continente/:id', paisController.listarPorContinente);

// Rotas genéricas
router.get('/', paisController.listar);
router.get('/:id', paisController.buscarPorId);
router.post('/', paisController.criar);
router.put('/:id', paisController.atualizar);
router.delete('/:id', paisController.deletar);

export default router;
```

### Camada de Controllers

**Responsabilidade:** Lógica de negócio, validações, resposta HTTP

**Exemplo:** `backend/src/controllers/paises.controller.ts`

```typescript
import { Request, Response } from 'express';
import prisma from '../config/database';

export class PaisController {
  async listar(req: Request, res: Response) {
    try {
      const { page = '1', limit = '20', continenteId } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      
      const where = continenteId 
        ? { continenteId: Number(continenteId) }
        : {};
      
      const [paises, total] = await Promise.all([
        prisma.pais.findMany({
          where,
          include: {
            continente: true,
            _count: { select: { cidades: true } }
          },
          skip,
          take: Number(limit),
          orderBy: { nome: 'asc' }
        }),
        prisma.pais.count({ where })
      ]);
      
      // Converter BigInt para string (fix serialização JSON)
      const paisesJSON = paises.map(pais => ({
        ...pais,
        populacao: pais.populacao?.toString()
      }));
      
      res.json({
        data: paisesJSON,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erro ao listar países:', error);
      res.status(500).json({ error: 'Erro ao listar países' });
    }
  }
  
  // ... outros métodos
}
```

### Camada de Services

**Responsabilidade:** Integração com APIs externas

**Exemplo:** `backend/src/services/geonames.service.ts`

```typescript
import axios from 'axios';

const GEONAMES_BASE_URL = 'http://api.geonames.org';
const username = process.env.GEONAMES_USERNAME || 'demo';

export class GeoNamesService {
  static async buscarPaisPorCodigo(codigo: string) {
    const response = await axios.get(`${GEONAMES_BASE_URL}/countryInfoJSON`, {
      params: {
        country: codigo.toUpperCase(),
        username,
        lang: 'pt'
      }
    });
    
    const paises = response.data.geonames || [];
    return paises.length > 0 ? paises[0] : null;
  }
  
  static async buscarPaisPorNome(nome: string) {
    const response = await axios.get(`${GEONAMES_BASE_URL}/countryInfoJSON`, {
      params: { username }
    });
    
    const paises = response.data.geonames || [];
    const nomeLower = nome.toLowerCase().trim();
    
    // Busca inteligente: exata → início → palavra → parcial
    return paises.find(p => 
      p.countryName.toLowerCase() === nomeLower ||
      p.countryName.toLowerCase().startsWith(nomeLower) ||
      p.countryName.toLowerCase().split(' ').includes(nomeLower)
    ) || null;
  }
}
```

### Middleware de Autenticação

**Arquivo:** `backend/src/middleware/auth.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  email: string;
}

export const authMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  const [, token] = authHeader.split(' ');
  
  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'secret'
    ) as TokenPayload;
    
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    
    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
```

### Server Configuration

**Arquivo:** `backend/src/server.ts`

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import continentesRoutes from './routes/continentes.routes';
import paisesRoutes from './routes/paises.routes';
import cidadesRoutes from './routes/cidades.routes';
import usuariosRoutes from './routes/usuarios.routes';
import visitasRoutes from './routes/visitas.routes';
import externalRoutes from './routes/external.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/continentes', continentesRoutes);
app.use('/api/paises', paisesRoutes);
app.use('/api/cidades', cidadesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/visitas', visitasRoutes);
app.use('/api/external', externalRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Servidor rodando na porta ${PORT}`);
  console.log(`✓ http://localhost:${PORT}`);
});
```

---

## Frontend

### Estrutura de Pastas

```
frontend/
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── Loading.tsx    # Loading spinner
│   │   ├── Navbar.tsx     # Barra de navegação
│   │   └── Pagination.tsx # Paginação
│   ├── contexts/          # React Context API
│   │   └── AuthContext.tsx
│   ├── pages/             # Páginas da aplicação
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Registrar/
│   │   ├── Continentes/
│   │   ├── Paises/
│   │   ├── Cidades/
│   │   └── Diario/
│   ├── services/          # API client
│   │   └── api.ts
│   ├── styles/            # Estilos globais
│   │   └── global.css
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Entry point
│   └── vite-env.d.ts
├── public/                # Arquivos estáticos
├── index.html             # HTML template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Context API - Autenticação

**Arquivo:** `frontend/src/contexts/AuthContext.tsx`

```typescript
import { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, LoginCredentials, RegisterData } from '../types';
import { usuariosAPI } from '../services/api';

interface AuthContextData {
  usuario: Usuario | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  registrar: (data: RegisterData) => Promise<void>;
  logout: () => void;
  recarregarUsuario: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar do localStorage
    const storedToken = localStorage.getItem('token');
    const storedUsuario = localStorage.getItem('usuario');

    if (storedToken && storedUsuario) {
      const user = JSON.parse(storedUsuario);
      setToken(storedToken);
      setUsuario(user);
      
      // Atualizar em background
      usuariosAPI.perfil(user.id)
        .then(response => {
          const usuarioAtualizado = response.data;
          localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
          setUsuario(usuarioAtualizado);
        })
        .catch(error => {
          console.error('Erro ao atualizar usuário:', error);
        });
    }

    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await usuariosAPI.login(credentials);
    const { token, usuario } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    setToken(token);
    setUsuario(usuario);
  };

  const registrar = async (data: RegisterData) => {
    await usuariosAPI.registrar(data);
    await login({ email: data.email, senha: data.senha });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  const recarregarUsuario = async () => {
    if (!usuario) return;
    const response = await usuariosAPI.perfil(usuario.id);
    const usuarioAtualizado = response.data;
    localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
    setUsuario(usuarioAtualizado);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        loading,
        login,
        registrar,
        logout,
        recarregarUsuario,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### API Client

**Arquivo:** `frontend/src/services/api.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Interceptor para adicionar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Exports organizados por recurso
export const continentesAPI = {
  listar: (page = 1, limit = 20) =>
    api.get(`/api/continentes`, { params: { page, limit } }),
  buscarPorId: (id: number) =>
    api.get(`/api/continentes/${id}`),
  criar: (data: any) =>
    api.post(`/api/continentes`, data),
  // ... outros métodos
};

export const paisesAPI = { /* ... */ };
export const cidadesAPI = { /* ... */ };
export const usuariosAPI = { /* ... */ };
export const visitasAPI = { /* ... */ };
export const externalAPI = { /* ... */ };

export default api;
```

### Roteamento

**Arquivo:** `frontend/src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Registrar from './pages/Registrar';
import ListaPaises from './pages/Paises/ListaPaises';
import FormPais from './pages/Paises/FormPais';
import DetalhesPais from './pages/Paises/DetalhesPais';
// ... outras páginas

// Components
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Registrar />} />
          
          <Route path="/paises" element={<ListaPaises />} />
          <Route path="/paises/novo" element={<FormPais />} />
          <Route path="/paises/:id" element={<DetalhesPais />} />
          <Route path="/paises/:id/editar" element={<FormPais />} />
          
          {/* ... outras rotas */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## Segurança

### Autenticação JWT

**Fluxo de Login:**

1. Cliente envia `{ email, senha }` para `/api/usuarios/login`
2. Backend valida senha com bcrypt
3. Backend gera JWT com payload `{ id, email }`
4. JWT é assinado com `JWT_SECRET`
5. Token retornado ao cliente com expiração de 7 dias
6. Cliente armazena token no localStorage
7. Cliente adiciona token no header: `Authorization: Bearer <token>`
8. Middleware verifica token em rotas protegidas

**Implementação:**

```typescript
// Login - usuarios.controller.ts
const token = jwt.sign(
  { id: usuario.id, email: usuario.email },
  process.env.JWT_SECRET || 'secret',
  { expiresIn: '7d' }
);

// Middleware - auth.middleware.ts
const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
req.userId = decoded.id;
```

### Hash de Senhas

**Bcrypt com salt rounds 10:**

```typescript
// Registro
const senhaHash = await bcrypt.hash(senha, 10);

// Login
const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
```

### CORS

**Configuração permitindo apenas origem específica:**

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### Validações

**Backend:**
- Validação de campos obrigatórios
- Validação de tipos de dados
- Validação de unicidade (email, códigos ISO)
- Sanitização de inputs

**Frontend:**
- Validação de formulários
- Campos required
- Máscaras de input
- Feedback de erro

---

## Performance e Otimizações

### Backend

**1. Paginação Padrão**
```typescript
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
```

**2. Eager Loading com Prisma**
```typescript
include: {
  continente: true,
  _count: { select: { cidades: true } }
}
```

**3. Queries Otimizadas**
```typescript
// Buscar count e dados em paralelo
const [paises, total] = await Promise.all([
  prisma.pais.findMany({ /* ... */ }),
  prisma.pais.count({ where })
]);
```

**4. Conversão BigInt**
```typescript
// Evitar erro de serialização JSON
const paisesJSON = paises.map(pais => ({
  ...pais,
  populacao: pais.populacao?.toString()
}));
```

### Frontend

**1. Code Splitting**
```typescript
// Vite faz automaticamente
const Component = lazy(() => import('./Component'));
```

**2. Memorização**
```typescript
const memoizedValue = useMemo(() => {
  return expensiveComputation(data);
}, [data]);
```

**3. Debounce em Buscas**
```typescript
const debouncedSearch = useCallback(
  debounce((query) => api.search(query), 300),
  []
);
```

**4. Loading States**
```typescript
if (loading) return <Loading />;
if (error) return <Error message={error} />;
return <Content data={data} />;
```

### Caching

**LocalStorage:**
- Token JWT
- Dados do usuário
- Preferências

**Estado React:**
- Dados carregados permanecem em memória
- Evita re-fetches desnecessários

---
