-- TABELA: continentes
CREATE TABLE "continentes" (
    "id" SERIAL NOT NULL,                    
    "nome" VARCHAR(100) NOT NULL,            -- Nome do continente 
    "descricao" TEXT,                        -- Descrição opcional do continente
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Data/hora de criação
    "updatedAt" TIMESTAMP(3) NOT NULL,       -- Data/hora da última atualização

    CONSTRAINT "continentes_pkey" PRIMARY KEY ("id")  -- 'id' como chave primária
);

-- TABELA: paises
CREATE TABLE "paises" (
    "id" SERIAL NOT NULL,                    
    "nome" VARCHAR(100) NOT NULL,            -- Nome do país 
    "populacao" BIGINT,                      -- População total 
    "idiomaOficial" VARCHAR(100),            -- Idioma oficial
    "moeda" VARCHAR(50),                     -- Moeda 
    "codigoPais" VARCHAR(3),                 -- Código ISO-3 do país (ex: "BRA")
    "continenteId" INTEGER NOT NULL,         -- Chave estrangeira: vinculada ao continente
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paises_pkey" PRIMARY KEY ("id")
);


-- TABELA: cidades
CREATE TABLE "cidades" (
    "id" SERIAL NOT NULL,                    
    "nome" VARCHAR(150) NOT NULL,            -- Nome da cidade 
    "populacao" INTEGER,                     -- População da cidade
    "latitude" DECIMAL(10,7) NOT NULL,       -- Coordenada de latitude
    "longitude" DECIMAL(10,7) NOT NULL,      -- Coordenada de longitude 
    "paisId" INTEGER NOT NULL,               -- Chave estrangeira: vinculada ao país
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cidades_pkey" PRIMARY KEY ("id")
);

-- TABELA: usuarios
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,                   
    "nome" VARCHAR(100) NOT NULL,            -- Nome completo do usuário
    "email" VARCHAR(150) NOT NULL,           -- Email (usado para login, único)
    "senhaHash" VARCHAR(255) NOT NULL,       -- Senha criptografada com bcrypt
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- TABELA: visitas
-- Registra as cidades visitadas por cada usuário (diário de viagens)
-- Um usuário só pode registrar uma visita por cidade (constraint UNIQUE)
CREATE TABLE "visitas" (
    "id" SERIAL NOT NULL,                    
    "usuarioId" INTEGER NOT NULL,            -- Chave estrangeira: qual usuário fez a visita
    "cidadeId" INTEGER NOT NULL,             -- Chave estrangeira: qual cidade foi visitada
    "dataVisita" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Data da visita
    "comentario" TEXT,                       -- Comentário opcional sobre a visita
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visitas_pkey" PRIMARY KEY ("id")
);

-- ÍNDICES ÚNICOS
-- Garantir que não haverá valores duplicados

-- Garante que não existam dois continentes com o mesmo nome
CREATE UNIQUE INDEX "continentes_nome_key" ON "continentes"("nome");

-- Garante que cada usuário tenha um e-mail único (não permite e-mails duplicados)
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- Garante que um usuário não possa registrar a mesma cidade duas vezes
CREATE UNIQUE INDEX "visitas_usuarioId_cidadeId_key" ON "visitas"("usuarioId", "cidadeId");

-- ÍNDICES PARA PERFORMANCE
-- Acelerar consultas que filtram por chaves estrangeiras

-- Acelerar buscas de países por continente 
CREATE INDEX "paises_continenteId_idx" ON "paises"("continenteId");

-- Acelerar buscas de cidades por país
CREATE INDEX "cidades_paisId_idx" ON "cidades"("paisId");

-- Acelerar buscas de visitas por usuário
CREATE INDEX "visitas_usuarioId_idx" ON "visitas"("usuarioId");

-- Acelerar buscas de visitas por cidade
CREATE INDEX "visitas_cidadeId_idx" ON "visitas"("cidadeId");

-- CHAVES ESTRANGEIRAS (FOREIGN KEYS) relacionamentos entre tabelas
-- ON DELETE CASCADE: Se um registro pai for excluído, os filhos também são
-- ON UPDATE CASCADE: Se a chave primária mudar, as referências são atualizadas

-- Países pertencem a Continentes
-- Se um continente for excluído, todos os países dele também serão
ALTER TABLE "paises" ADD CONSTRAINT "paises_continenteId_fkey" 
    FOREIGN KEY ("continenteId") REFERENCES "continentes"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Cidades pertencem a Países
-- Se um país for excluído, todas as cidades dele também serão
ALTER TABLE "cidades" ADD CONSTRAINT "cidades_paisId_fkey" 
    FOREIGN KEY ("paisId") REFERENCES "paises"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Visitas pertencem a Usuários
-- Se um usuário for excluído, todas as visitas dele também serão
ALTER TABLE "visitas" ADD CONSTRAINT "visitas_usuarioId_fkey" 
    FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Visitas são feitas em Cidades
-- Se uma cidade for excluída, todas as visitas a ela também serão
ALTER TABLE "visitas" ADD CONSTRAINT "visitas_cidadeId_fkey" 
    FOREIGN KEY ("cidadeId") REFERENCES "cidades"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;
