# 📦 Instalação e Setup - ViagemTrack

Guia completo de instalação e configuração do projeto ViagemTrack.

## 📋 Sumário

- [Pré-requisitos](#pré-requisitos)
- [Instalação do Backend](#instalação-do-backend)
- [Instalação do Frontend](#instalação-do-frontend)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Configuração das APIs Externas](#configuração-das-apis-externas)
- [Iniciando o Projeto](#iniciando-o-projeto)
- [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Obrigatórios

| Software | Versão Mínima | Download |
|----------|---------------|----------|
| **Node.js** | 18.0.0 | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.0.0 | Incluído com Node.js |
| **PostgreSQL** | 14.0 | [postgresql.org](https://www.postgresql.org/download/) |
| **Git** | 2.30.0 | [git-scm.com](https://git-scm.com/) |

### Recomendados

- **VS Code** - Editor de código
- **Postman** ou **Insomnia** - Testar API
- **pgAdmin** ou **DBeaver** - Gerenciar banco de dados

### Verificando Instalações

```bash
# Verificar versões instaladas
node --version    # Deve mostrar v18.0.0 ou superior
npm --version     # Deve mostrar 9.0.0 ou superior
psql --version    # Deve mostrar 14.0 ou superior
git --version     # Deve mostrar 2.30.0 ou superior
```

---

## 🔽 Clonando o Repositório

```bash
# Clone o repositório
git clone https://github.com/mariana-lins/VIAGEMTRACK_PROGWEB_FATEC.git

# Entre na pasta do projeto
cd VIAGEMTRACK_PROGWEB_FATEC

# Verifique a estrutura
ls
# Você deve ver: backend/ frontend/ docs/ README.md
```

---

## ⚙️ Instalação do Backend

### 1. Instalar Dependências

```bash
cd backend
npm install
```

**Dependências principais que serão instaladas:**
- express (^4.18.2)
- @prisma/client (^5.22.0)
- typescript (^5.0.0)
- bcrypt (^5.1.1)
- jsonwebtoken (^9.0.2)
- cors (^2.8.5)
- dotenv (^16.3.1)
- axios (^1.6.0)

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar arquivo .env
# No Windows: notepad .env
# No Mac/Linux: nano .env
```

**Arquivo `.env` - Configuração Obrigatória:**

```env
# DATABASE - OBRIGATÓRIO
DATABASE_URL="postgresql://usuario:senha@localhost:5432/viagemtrack"

# Substitua:
# - usuario: seu usuário do PostgreSQL (padrão: postgres)
# - senha: sua senha do PostgreSQL
# - localhost: endereço do servidor (localhost para desenvolvimento)
# - 5432: porta do PostgreSQL (padrão: 5432)
# - viagemtrack: nome do banco de dados

# JWT - OBRIGATÓRIO
JWT_SECRET="sua_chave_secreta_muito_segura_aqui_123456789"
# Dica: Use uma string aleatória longa e complexa

# SERVIDOR - OPCIONAL (valores padrão funcionam)
PORT=3000
NODE_ENV=development

# GEONAMES API - OPCIONAL (funciona com 'demo' mas tem limites)
GEONAMES_USERNAME=demo
# Para melhor performance, crie conta grátis em: https://www.geonames.org/login

# WEATHER API - OPCIONAL (necessário apenas para widget de clima)
WEATHER_API_KEY=
# Criar conta grátis em: https://www.weatherapi.com/signup.aspx
```

### 3. Gerar Cliente Prisma

```bash
# Ainda na pasta backend/
npx prisma generate
```

Este comando gera o Prisma Client baseado no schema.

### 4. Executar Migrations

```bash
# Criar banco de dados e executar migrations
npx prisma migrate dev

# Você verá:
# ✔ Database created successfully
# ✔ Migrations applied successfully
```

**Estrutura do banco criada:**
- Tabela: `continentes`
- Tabela: `paises`
- Tabela: `cidades`
- Tabela: `usuarios`
- Tabela: `visitas`

### 5. Popular Banco com Dados Iniciais (Seed)

```bash
npm run seed
```

**Dados que serão inseridos:**
- 6 Continentes (África, América, Ásia, Europa, Oceania, Antártida)
- 40 Países (Brasil, Estados Unidos, França, Japão, etc)
- Dados completos: população, capital, idioma, moeda

### 6. Testar Backend

```bash
# Iniciar servidor
npm run dev

# Você deve ver:
# ✓ Servidor rodando na porta 3000
# ✓ http://localhost:3000
```

**Testar no navegador ou terminal:**

```bash
# Health check
curl http://localhost:3000/health
# Resposta: {"status":"ok"}

# Listar continentes
curl http://localhost:3000/api/continentes
# Resposta: { data: [...], pagination: {...} }
```

---

## 🎨 Instalação do Frontend

### 1. Instalar Dependências

```bash
# Voltar para raiz do projeto
cd ..

# Entrar na pasta frontend
cd frontend

# Instalar dependências
npm install
```

**Dependências principais que serão instaladas:**
- react (^18.3.0)
- react-dom (^18.3.0)
- react-router-dom (^6.20.0)
- axios (^1.6.0)
- typescript (^5.0.0)
- vite (^5.0.0)

### 2. Configurar Variáveis de Ambiente (Opcional)

```bash
# Copiar arquivo de exemplo (se existir)
cp .env.example .env
```

**Arquivo `.env` - Frontend:**

```env
# URL da API (padrão funciona para desenvolvimento local)
VITE_API_URL=http://localhost:3000
```

### 3. Testar Frontend

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Você deve ver:
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose
```

Abra o navegador em: **http://localhost:5173**

---

## 🗄️ Configuração do Banco de Dados

### Windows

#### 1. Instalar PostgreSQL

1. Baixar instalador: [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Executar instalador
3. Definir senha para usuário `postgres`
4. Porta padrão: `5432`
5. Iniciar serviço automaticamente: `Sim`

#### 2. Criar Banco de Dados

**Opção 1: Via pgAdmin**
1. Abrir pgAdmin
2. Conectar ao servidor
3. Botão direito em "Databases" → "Create" → "Database"
4. Nome: `viagemtrack`
5. Owner: `postgres`

**Opção 2: Via Terminal**
```bash
psql -U postgres
CREATE DATABASE viagemtrack;
\q
```

### Mac

```bash
# Instalar PostgreSQL via Homebrew
brew install postgresql@15

# Iniciar serviço
brew services start postgresql@15

# Criar banco de dados
createdb viagemtrack
```

### Linux (Ubuntu/Debian)

```bash
# Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Iniciar serviço
sudo systemctl start postgresql

# Criar banco de dados
sudo -u postgres createdb viagemtrack

# Criar usuário (opcional)
sudo -u postgres createuser --interactive --pwprompt
```

### Verificar Conexão

```bash
# Testar conexão
psql -U postgres -d viagemtrack

# Você deve ver:
# viagemtrack=#

# Sair
\q
```

---

## 🌐 Configuração das APIs Externas

### GeoNames API (Opcional mas Recomendado)

**Status Atual:** Funciona com username `demo` mas tem limites baixos.

**Para melhor performance:**

1. Criar conta gratuita: https://www.geonames.org/login
2. Após login, ir em: **Account → Free Web Services**
3. Clicar em: **Click here to enable**
4. Copiar seu username
5. Atualizar `backend/.env`:

```env
GEONAMES_USERNAME=seu_usuario_aqui
```

**Limites:**
- Demo: 2.000 requisições/dia
- Conta grátis: 20.000 requisições/dia

### WeatherAPI (Necessário para Widget de Clima)

**Status:** Widget de clima não funciona sem esta configuração.

**Configurar:**

1. Criar conta gratuita: https://www.weatherapi.com/signup.aspx
2. Após login, copiar sua **API Key** do dashboard
3. Atualizar `backend/.env`:

```env
WEATHER_API_KEY=sua_chave_aqui
```

4. Reiniciar backend:

```bash
cd backend
npm run dev
```

**Limites da conta gratuita:**
- 1.000.000 requisições/mês
- Dados atuais + previsão 3 dias
- Sem necessidade de cartão de crédito

### Flagpedia (Já Funciona)

**Status:** ✅ Não requer configuração

API pública que fornece URLs de bandeiras dos países.

---

## 🚀 Iniciando o Projeto

### Desenvolvimento Local

Você precisa de **2 terminais** abertos:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev

# Aguarde:
# ✓ Servidor rodando na porta 3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev

# Aguarde:
# ➜  Local:   http://localhost:5173/
```

### Acessar Aplicação

Abra o navegador em: **http://localhost:5173**

### Primeira Execução

1. Clique em "Começar Agora" ou "Registrar"
2. Crie sua conta:
   - Nome: Seu nome
   - Email: seu@email.com
   - Senha: mínimo 6 caracteres
3. Você será logado automaticamente
4. Explore o sistema!

### Testando Funcionalidades

**Criar País Automaticamente:**
1. Ir em "Países" → "Nova País"
2. Digite nome: `Brazil` (em inglês funciona melhor)
3. Clique em "🌐 Buscar por Nome"
4. Dados serão preenchidos automaticamente
5. Selecione o continente
6. Salvar

**Criar Cidade Automaticamente:**
1. Ir em "Cidades" → "Nova Cidade"
2. Digite nome: `Tokyo`
3. Clique em "🌐 Buscar Dados"
4. Dados serão preenchidos (lat, lng, população)
5. Selecione o país
6. Salvar

**Marcar Cidade como Visitada:**
1. Ir em "Cidades"
2. Clique em "Marcar como Visitada" em qualquer card
3. Cidade aparecerá em "Meu Diário"

---

## 🐛 Troubleshooting

### Backend não inicia

**Erro: Cannot find module**
```bash
# Solução: Reinstalar dependências
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Erro: Port 3000 already in use**
```bash
# Solução 1: Matar processo na porta 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <numero_do_pid> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Solução 2: Mudar porta no .env
PORT=3001
```

**Erro: PostgreSQL connection refused**
```bash
# Verificar se PostgreSQL está rodando
# Windows: Abrir "Serviços" e verificar PostgreSQL
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# Verificar credenciais no .env
# Testar conexão manual:
psql -U postgres -d viagemtrack
```

**Erro: Prisma Client not generated**
```bash
cd backend
npx prisma generate
```

**Erro: Migrations não aplicadas**
```bash
cd backend
npx prisma migrate dev
```

### Frontend não inicia

**Erro: Cannot find module**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Erro: Port 5173 already in use**
```bash
# Matar processo na porta 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <numero_do_pid> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

### Frontend não conecta ao Backend

**Erro: Network Error ou CORS**

1. Verificar se backend está rodando:
```bash
curl http://localhost:3000/health
```

2. Verificar CORS no backend (`backend/src/server.ts`):
```typescript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

3. Verificar URL da API no frontend (`frontend/src/services/api.ts`):
```typescript
const api = axios.create({
  baseURL: 'http://localhost:3000',
});
```

### Erro de Serialização BigInt

**Erro: "Do not know how to serialize a BigInt"**

✅ **Já corrigido no código!**

Se ainda ocorrer, verificar se os controllers estão convertendo BigInt para string:

```typescript
// Em paises.controller.ts, cidades.controller.ts, visitas.controller.ts
const paisJSON = {
  ...pais,
  populacao: pais.populacao?.toString()
};
```

### GeoNames API retorna 404

**Erro: User account not found or not activated**

Solução:
1. Criar conta em: https://www.geonames.org/login
2. Ativar "Free Web Services" no perfil
3. Atualizar `.env` com seu username
4. Reiniciar backend

**Erro: Daily limit exceeded**

Solução:
- Conta demo tem limite de 2.000 req/dia
- Criar conta grátis aumenta para 20.000 req/dia

### WeatherAPI não funciona

**Erro: Widget de clima não carrega**

Verificar:
1. `WEATHER_API_KEY` está configurada no `.env`
2. API Key é válida (testar no site do WeatherAPI)
3. Backend foi reiniciado após adicionar a chave

### Banco de Dados Vazio

**Problema: Sem continentes nem países**

Solução:
```bash
cd backend
npm run seed
```

### Resetar Banco de Dados

```bash
cd backend

# Opção 1: Resetar e recriar
npx prisma migrate reset
# ⚠️ Isso vai APAGAR todos os dados!

# Opção 2: Apenas popular novamente
npm run seed
```

### Problemas com Prisma

**Erro: Prisma Client out of sync**
```bash
cd backend
npx prisma generate
```

**Erro: Migration failed**
```bash
# Resetar migrations
npx prisma migrate reset

# Criar nova migration
npx prisma migrate dev --name init
```

### Build para Produção

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## ✅ Checklist de Instalação

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL 14+ instalado
- [ ] Repositório clonado
- [ ] Backend: `npm install` executado
- [ ] Backend: `.env` configurado
- [ ] Backend: `npx prisma generate` executado
- [ ] Backend: `npx prisma migrate dev` executado
- [ ] Backend: `npm run seed` executado
- [ ] Backend: `npm run dev` rodando
- [ ] Frontend: `npm install` executado
- [ ] Frontend: `npm run dev` rodando
- [ ] Navegador acessando `http://localhost:5173`
- [ ] (Opcional) GeoNames username configurado
- [ ] (Opcional) WeatherAPI key configurada

---

**Instalação concluída! 🎉**


