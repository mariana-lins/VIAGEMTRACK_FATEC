-- OBJETIVO: Adicionar novos campos às tabelas de países e cidades
-- Esta migração foi criada porque o frontend precisava de campos que não existiam no banco de dados inicial

-- ALTERAÇÕES NA TABELA: cidades
-- Adiciona nova coluna: clima
-- Armazena informações sobre o clima da cidade para exibir dados climáticos da cidade

ALTER TABLE "cidades" ADD COLUMN "clima" VARCHAR(100);

-- Torna a coluna latitude OPCIONAL (permite NULL)
ALTER TABLE "cidades" ALTER COLUMN "latitude" DROP NOT NULL;

-- Torna a coluna longitude OPCIONAL (permite NULL)
-- Coordenadas podem ser adicionadas depois via integração com GeoNames API
ALTER TABLE "cidades" ALTER COLUMN "longitude" DROP NOT NULL;

-- ALTERAÇÕES NA TABELA: paises
-- Adiciona nova coluna: capital
-- Armazena o nome da capital do país 
-- Preenchida automaticamente pelo botão "Buscar Dados" (GeoNames API)
ALTER TABLE "paises" ADD COLUMN "capital" VARCHAR(100);

-- Adiciona nova coluna: codigoISO
-- Código ISO de 2 letras do país (ex: "BR", "US", "FR")
-- Usado para exibir bandeiras via Flagpedia API
ALTER TABLE "paises" ADD COLUMN "codigoISO" VARCHAR(2);

-- Adiciona nova coluna: idioma
-- Idioma(s) falado(s) no país 
-- Complementa o campo idiomaOficial já existente
ALTER TABLE "paises" ADD COLUMN "idioma" VARCHAR(100);
