/**
 * Este arquivo popula automaticamente o banco de dados com dados iniciais de continentes e países
 * 
 * - Insere os 6 continentes do mundo
 * - Insere 40 países principais com dados completos
 * - Evita cadastro manual de dados básicos
 * 
 * COMO EXECUTAR:
 * ```bash
 * cd backend
 * npm run seed
 * ```
 * 
 * ATENÇÃO:
 * - Este script NÃO apaga dados existentes
 * - Apenas insere continentes e países que ainda não existem no banco
 * - Dados criados manualmente no site são PRESERVADOS
 * - Pode ser executado várias vezes sem perder dados
 * 
 * ADICIONAR MAIS PAÍSES:
 * 1. Localize o objeto 'paisesPorContinente' abaixo
 * 2. Adicione o novo país no continente correto seguindo o formato:
 *    { 
 *      nome: 'Nome do País',
 *      capital: 'Nome da Capital', 
 *      idioma: 'Idioma(s)',
 *      codigoISO: 'XX',  // Código de 2 letras para buscar bandeira
 *      populacao: 12345678 
 *    }
 * 3. Execute novamente: npm run seed
 * 
 * EXEMPLO DE ADIÇÃO:
 * 'Europa': [
 *   // ... países existentes
 *   { nome: 'Suíça', capital: 'Berna', idioma: 'Alemão, Francês, Italiano', codigoISO: 'CH', populacao: 8654622 },
 * ]
 * 
 * CÓDIGOS ISO:
 * - BR (Brasil), US (Estados Unidos), FR (França), etc.
 * - Lista completa: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
 * - Usado para buscar bandeiras automaticamente no sistema
 * 
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DADOS DOS CONTINENTES
// Todos os 6 continentes 
const continentes = [
  { nome: 'África', descricao: 'Continente africano, berço da humanidade' },
  { nome: 'América', descricao: 'Continente americano, dividido em América do Norte, Central e do Sul' },
  { nome: 'Ásia', descricao: 'Maior continente em área e população' },
  { nome: 'Europa', descricao: 'Continente europeu, berço da civilização ocidental' },
  { nome: 'Oceania', descricao: 'Continente formado por ilhas do Pacífico, incluindo Austrália e Nova Zelândia' },
  { nome: 'Antártida', descricao: 'Continente gelado no extremo sul do planeta' }
];

// DADOS DOS PAÍSES ORGANIZADOS POR CONTINENTE
// 40 países principais do mundo com informações completas
// Para adicionar mais países, basta incluir no array do continente correspondente
const paisesPorContinente: Record<string, any[]> = {
  // ÁFRICA - 8 países principais
  'África': [
    { nome: 'África do Sul', capital: 'Pretória', idioma: 'Africâner, Inglês', codigoISO: 'ZA', populacao: 59308690 },
    { nome: 'Argélia', capital: 'Argel', idioma: 'Árabe', codigoISO: 'DZ', populacao: 43851044 },
    { nome: 'Angola', capital: 'Luanda', idioma: 'Português', codigoISO: 'AO', populacao: 32866272 },
    { nome: 'Egito', capital: 'Cairo', idioma: 'Árabe', codigoISO: 'EG', populacao: 102334404 },
    { nome: 'Etiópia', capital: 'Adis Abeba', idioma: 'Amárico', codigoISO: 'ET', populacao: 114963588 },
    { nome: 'Marrocos', capital: 'Rabat', idioma: 'Árabe', codigoISO: 'MA', populacao: 36910560 },
    { nome: 'Nigéria', capital: 'Abuja', idioma: 'Inglês', codigoISO: 'NG', populacao: 206139589 },
    { nome: 'Quênia', capital: 'Nairóbi', idioma: 'Suaíli, Inglês', codigoISO: 'KE', populacao: 53771296 }
  ],
  
  // AMÉRICA - 9 países (Norte, Central e Sul)

  'América': [
    { nome: 'Argentina', capital: 'Buenos Aires', idioma: 'Espanhol', codigoISO: 'AR', populacao: 45195774 },
    { nome: 'Brasil', capital: 'Brasília', idioma: 'Português', codigoISO: 'BR', populacao: 212559417 },
    { nome: 'Canadá', capital: 'Ottawa', idioma: 'Inglês, Francês', codigoISO: 'CA', populacao: 37742154 },
    { nome: 'Chile', capital: 'Santiago', idioma: 'Espanhol', codigoISO: 'CL', populacao: 19116201 },
    { nome: 'Colômbia', capital: 'Bogotá', idioma: 'Espanhol', codigoISO: 'CO', populacao: 50882891 },
    { nome: 'Estados Unidos', capital: 'Washington D.C.', idioma: 'Inglês', codigoISO: 'US', populacao: 331002651 },
    { nome: 'México', capital: 'Cidade do México', idioma: 'Espanhol', codigoISO: 'MX', populacao: 128932753 },
    { nome: 'Peru', capital: 'Lima', idioma: 'Espanhol', codigoISO: 'PE', populacao: 32971854 },
    { nome: 'Venezuela', capital: 'Caracas', idioma: 'Espanhol', codigoISO: 'VE', populacao: 28435940 }
  ],
  

  // ÁSIA - 9 países 

  'Ásia': [
    { nome: 'Arábia Saudita', capital: 'Riade', idioma: 'Árabe', codigoISO: 'SA', populacao: 34813871 },
    { nome: 'China', capital: 'Pequim', idioma: 'Mandarim', codigoISO: 'CN', populacao: 1439323776 },
    { nome: 'Coreia do Sul', capital: 'Seul', idioma: 'Coreano', codigoISO: 'KR', populacao: 51269185 },
    { nome: 'Filipinas', capital: 'Manila', idioma: 'Filipino, Inglês', codigoISO: 'PH', populacao: 109581078 },
    { nome: 'Índia', capital: 'Nova Délhi', idioma: 'Hindi, Inglês', codigoISO: 'IN', populacao: 1380004385 },
    { nome: 'Indonésia', capital: 'Jacarta', idioma: 'Indonésio', codigoISO: 'ID', populacao: 273523615 },
    { nome: 'Japão', capital: 'Tóquio', idioma: 'Japonês', codigoISO: 'JP', populacao: 126476461 },
    { nome: 'Tailândia', capital: 'Bangkok', idioma: 'Tailandês', codigoISO: 'TH', populacao: 69799978 },
    { nome: 'Turquia', capital: 'Ancara', idioma: 'Turco', codigoISO: 'TR', populacao: 84339067 }
  ],
  
  // EUROPA - 10 países principais

  'Europa': [
    { nome: 'Alemanha', capital: 'Berlim', idioma: 'Alemão', codigoISO: 'DE', populacao: 83783942 },
    { nome: 'Espanha', capital: 'Madrid', idioma: 'Espanhol', codigoISO: 'ES', populacao: 46754778 },
    { nome: 'França', capital: 'Paris', idioma: 'Francês', codigoISO: 'FR', populacao: 65273511 },
    { nome: 'Grécia', capital: 'Atenas', idioma: 'Grego', codigoISO: 'GR', populacao: 10423054 },
    { nome: 'Itália', capital: 'Roma', idioma: 'Italiano', codigoISO: 'IT', populacao: 60461826 },
    { nome: 'Países Baixos', capital: 'Amsterdã', idioma: 'Holandês', codigoISO: 'NL', populacao: 17134872 },
    { nome: 'Polônia', capital: 'Varsóvia', idioma: 'Polonês', codigoISO: 'PL', populacao: 37846611 },
    { nome: 'Portugal', capital: 'Lisboa', idioma: 'Português', codigoISO: 'PT', populacao: 10196709 },
    { nome: 'Reino Unido', capital: 'Londres', idioma: 'Inglês', codigoISO: 'GB', populacao: 67886011 },
    { nome: 'Rússia', capital: 'Moscou', idioma: 'Russo', codigoISO: 'RU', populacao: 145934462 }
  ],
  

  // OCEANIA - 4 países 

  'Oceania': [
    { nome: 'Austrália', capital: 'Camberra', idioma: 'Inglês', codigoISO: 'AU', populacao: 25499884 },
    { nome: 'Fiji', capital: 'Suva', idioma: 'Inglês, Fijiano', codigoISO: 'FJ', populacao: 896445 },
    { nome: 'Nova Zelândia', capital: 'Wellington', idioma: 'Inglês, Maori', codigoISO: 'NZ', populacao: 4822233 },
    { nome: 'Papua Nova Guiné', capital: 'Port Moresby', idioma: 'Inglês', codigoISO: 'PG', populacao: 8947024 }
  ],
  
  // ANTÁRTIDA  não possui países soberanos
  'Antártida': []
};

// FUNÇÃO PRINCIPAL DE SEED
// Executa a inserção de todos os dados no banco de dados
async function main() {
  console.log(' Iniciando seed do banco de dados...\n');

  // ETAPA 1: Verificar dados existentes (SEM APAGAR)
  // Apenas insere o que não existe, preservando dados manuais
  console.log('Verificando dados existentes (modo seguro - sem apagar)...\n');

  // ETAPA 2: Inserção de continentes e países (apenas novos)
  // Verifica se já existe antes de inserir
  let continentesInseridos = 0;
  let paisesInseridos = 0;
  
  for (const continenteData of continentes) {
    // Verifica se o continente já existe pelo nome
    let continente = await prisma.continente.findFirst({
      where: { nome: continenteData.nome }
    });
    
    if (!continente) {
      // Continente não existe, criar novo
      continente = await prisma.continente.create({
        data: {
          nome: continenteData.nome,
          descricao: continenteData.descricao
        }
      });
      console.log(`Continente inserido: ${continenteData.nome}`);
      continentesInseridos++;
    } else {
      console.log(`Continente já existe: ${continenteData.nome} (ID: ${continente.id})`);
    }

    const paises = paisesPorContinente[continenteData.nome] || [];
    
    if (paises.length > 0) {
      console.log(`   Verificando ${paises.length} países do continente ${continenteData.nome}...`);
      
      for (const paisData of paises) {
        // Verifica se o país já existe pelo nome
        const paisExistente = await prisma.pais.findFirst({
          where: { nome: paisData.nome }
        });
        
        if (!paisExistente) {
          // País não existe, criar novo
          await prisma.pais.create({
            data: {
              nome: paisData.nome,
              capital: paisData.capital,
              idioma: paisData.idioma,
              idiomaOficial: paisData.idioma.split(',')[0].trim(),
              codigoISO: paisData.codigoISO,
              codigoPais: paisData.codigoISO.toLowerCase(),
              populacao: paisData.populacao,
              moeda: '',
              continenteId: continente.id
            }
          });
          paisesInseridos++;
        }
      }
      
      const paisesNovos = paisesInseridos > 0 ? `${paisesInseridos} novos inseridos` : 'todos já existem';
      console.log(`   ✓ ${paisesNovos}\n`);
    } else {
      console.log(`   └─ Sem países para inserir\n`);
    }
  }

  // ETAPA 3: Exibir estatísticas finais

  const totalContinentes = await prisma.continente.count();
  const totalPaises = await prisma.pais.count();

  console.log('Seed concluído com sucesso!');
  console.log(`Total de continentes no banco: ${totalContinentes}`);
  console.log(`Total de países no banco: ${totalPaises}`);
  console.log(`Continentes inseridos nesta execução: ${continentesInseridos}`);
  console.log(`Países inseridos nesta execução: ${paisesInseridos}`);
}

// EXECUÇÃO DO SCRIPT
// Executa a função main() e trata possíveis erros
main()
  .catch((e: Error) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
