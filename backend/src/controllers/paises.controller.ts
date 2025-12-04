import { Request, Response } from 'express';
import prisma from '../config/database';

export class PaisController {
  // Listar todos os países
  async listar(req: Request, res: Response) {
    try {
      const { page = '1', limit = '10', continenteId } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where = continenteId ? { continenteId: Number(continenteId) } : {};

      const [paises, total] = await Promise.all([
        prisma.pais.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            continente: {
              select: { id: true, nome: true }
            },
            _count: {
              select: { cidades: true }
            }
          },
          orderBy: { nome: 'asc' }
        }),
        prisma.pais.count({ where })
      ]);

      // Converter BigInt para string
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

  // Listar países por continente
  async listarPorContinente(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const paises = await prisma.pais.findMany({
        where: { continenteId: Number(id) },
        include: {
          _count: {
            select: { cidades: true }
          }
        },
        orderBy: { nome: 'asc' }
      });

      // Converter BigInt para string
      const paisesJSON = paises.map(pais => ({
        ...pais,
        populacao: pais.populacao?.toString()
      }));

      res.json(paisesJSON);
    } catch (error) {
      console.error('Erro ao listar países por continente:', error);
      res.status(500).json({ error: 'Erro ao listar países' });
    }
  }

  // Buscar país por ID
  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const pais = await prisma.pais.findUnique({
        where: { id: Number(id) },
        include: {
          continente: true,
          cidades: {
            select: {
              id: true,
              nome: true,
              populacao: true
            }
          }
        }
      });

      if (!pais) {
        return res.status(404).json({ error: 'País não encontrado' });
      }

      return res.json(pais);
    } catch (error) {
      console.error('Erro ao buscar país:', error);
      return res.status(500).json({ error: 'Erro ao buscar país' });
    }
  }

  // Criar novo país
  async criar(req: Request, res: Response) {
    try {
      const { nome, populacao, capital, idioma, idiomaOficial, moeda, codigoISO, codigoPais, continenteId } = req.body;

      if (!nome || !continenteId) {
        return res.status(400).json({ error: 'Nome e continenteId são obrigatórios' });
      }

      const pais = await prisma.pais.create({
        data: {
          nome,
          populacao: populacao ? BigInt(populacao) : null,
          capital,
          idioma: idioma || idiomaOficial,
          idiomaOficial: idiomaOficial || idioma,
          moeda,
          codigoISO,
          codigoPais: codigoPais || codigoISO,
          continenteId: Number(continenteId)
        },
        include: {
          continente: true
        }
      });

      // Converter BigInt para string no JSON
      const paisJSON = {
        ...pais,
        populacao: pais.populacao?.toString()
      };

      return res.status(201).json(paisJSON);
    } catch (error: any) {
      console.error('Erro ao criar país:', error);
      
      if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Continente não encontrado' });
      }
      
      return res.status(500).json({ error: 'Erro ao criar país' });
    }
  }

  // Atualizar país
  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, populacao, capital, idioma, idiomaOficial, moeda, codigoISO, codigoPais, continenteId } = req.body;

      const pais = await prisma.pais.update({
        where: { id: Number(id) },
        data: {
          nome,
          populacao: populacao ? BigInt(populacao) : null,
          capital,
          idioma: idioma || idiomaOficial,
          idiomaOficial: idiomaOficial || idioma,
          moeda,
          codigoISO,
          codigoPais: codigoPais || codigoISO,
          continenteId: continenteId ? Number(continenteId) : undefined
        },
        include: {
          continente: true
        }
      });

      const paisJSON = {
        ...pais,
        populacao: pais.populacao?.toString()
      };

      return res.json(paisJSON);
    } catch (error: any) {
      console.error('Erro ao atualizar país:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'País não encontrado' });
      }
      if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Continente não encontrado' });
      }
      
      return res.status(500).json({ error: 'Erro ao atualizar país' });
    }
  }

  // Excluir país
  async excluir(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.pais.delete({
        where: { id: Number(id) }
      });

      return res.status(204).send();
    } catch (error: any) {
      console.error('Erro ao excluir país:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'País não encontrado' });
      }
      
      return res.status(500).json({ error: 'Erro ao excluir país' });
    }
  }
}
