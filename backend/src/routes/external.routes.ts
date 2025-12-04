import { Router, Request, Response } from 'express';
import { GeoNamesService } from '../services/geonames.service';
import { WeatherService } from '../services/weather.service';
import { FlagService } from '../services/flag.service';

const router = Router();

// GeoNames - Buscar países
router.get('/geonames/paises', async (_req: Request, res: Response) => {
  try {
    const paises = await GeoNamesService.buscarPaises();
    return res.json(paises);
  } catch (error) {
    console.error('Erro ao buscar países:', error);
    return res.status(500).json({ error: 'Erro ao buscar países' });
  }
});

// GeoNames - Buscar país por código
router.get('/geonames/pais/:codigo', async (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;
    const pais = await GeoNamesService.buscarPaisPorCodigo(codigo);
    
    if (!pais) {
      return res.status(404).json({ error: 'País não encontrado' });
    }
    
    return res.json(pais);
  } catch (error) {
    console.error('Erro ao buscar país:', error);
    return res.status(500).json({ error: 'Erro ao buscar país' });
  }
});

// GeoNames - Buscar país por nome
router.get('/geonames/pais-por-nome', async (req: Request, res: Response) => {
  try {
    const { nome } = req.query;
    
    if (!nome) {
      return res.status(400).json({ error: 'Parâmetro nome é obrigatório' });
    }
    
    const pais = await GeoNamesService.buscarPaisPorNome(nome as string);
    
    if (!pais) {
      return res.status(404).json({ error: 'País não encontrado' });
    }
    
    return res.json(pais);
  } catch (error) {
    console.error('Erro ao buscar país por nome:', error);
    return res.status(500).json({ error: 'Erro ao buscar país por nome' });
  }
});

// GeoNames - Buscar cidades
router.get('/geonames/cidades', async (req: Request, res: Response) => {
  try {
    const { q, pais, limit = '10' } = req.query;
    
    if (!q && !pais) {
      return res.status(400).json({ error: 'Parâmetro q (nome) ou pais é obrigatório' });
    }

    let cidades;
    if (pais) {
      cidades = await GeoNamesService.buscarCidadesPorPais(pais as string, Number(limit));
    } else {
      cidades = await GeoNamesService.buscarCidades(q as string, Number(limit));
    }
    
    return res.json(cidades);
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    return res.status(500).json({ error: 'Erro ao buscar cidades' });
  }
});

// GeoNames - Buscar cidade por coordenadas
router.get('/geonames/cidade/:lat/:lng', async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.params;
    const cidade = await GeoNamesService.buscarCidadePorCoordenadas(
      Number(lat),
      Number(lng)
    );
    
    if (!cidade) {
      return res.status(404).json({ error: 'Cidade não encontrada' });
    }
    
    return res.json(cidade);
  } catch (error) {
    console.error('Erro ao buscar cidade:', error);
    return res.status(500).json({ error: 'Erro ao buscar cidade' });
  }
});

// Weather - Clima por coordenadas
router.get('/weather/coordenadas/:lat/:lon', async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.params;
    const clima = await WeatherService.obterClimaPorCoordenadas(
      Number(lat),
      Number(lon)
    );
    
    if (!clima) {
      return res.status(404).json({ error: 'Clima não disponível' });
    }
    
    return res.json(clima);
  } catch (error) {
    console.error('Erro ao obter clima:', error);
    return res.status(500).json({ error: 'Erro ao obter clima' });
  }
});

// Weather - Clima por cidade
router.get('/weather/cidade/:nome', async (req: Request, res: Response) => {
  try {
    const { nome } = req.params;
    const clima = await WeatherService.obterClimaPorCidade(nome);
    
    if (!clima) {
      return res.status(404).json({ error: 'Clima não disponível' });
    }
    
    return res.json(clima);
  } catch (error) {
    console.error('Erro ao obter clima:', error);
    return res.status(500).json({ error: 'Erro ao obter clima' });
  }
});

// Weather - Previsão do tempo
router.get('/weather/previsao/:lat/:lon', async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.params;
    const { dias = '3' } = req.query;
    
    const previsao = await WeatherService.obterPrevisao(
      Number(lat),
      Number(lon),
      Number(dias)
    );
    
    if (!previsao) {
      return res.status(404).json({ error: 'Previsão não disponível' });
    }
    
    return res.json(previsao);
  } catch (error) {
    console.error('Erro ao obter previsão:', error);
    return res.status(500).json({ error: 'Erro ao obter previsão' });
  }
});

// Flags - URLs de bandeiras
router.get('/flag/:codigo', (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;
    const urls = FlagService.getFlagUrls(codigo);
    return res.json(urls);
  } catch (error) {
    console.error('Erro ao gerar URLs de bandeiras:', error);
    return res.status(500).json({ error: 'Erro ao gerar URLs de bandeiras' });
  }
});

export default router;
