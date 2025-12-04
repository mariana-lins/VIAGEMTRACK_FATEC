import { Request, Response } from 'express';
import prisma from '../config/database';

export class ContinenteController {
  // Listar todos os continentes
  async listar(req: Request, res: Response) {
    try {
      const { page = '1', limit = '10' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const [continentes, total] = await Promise.all([
        prisma.continente.findMany({
          skip,
          take: Number(limit),
          include: {
            _count: {
              select: { paises: true }
            }
          },
          orderBy: { nome: 'asc' }
        }),
        prisma.continente.count()
      ]);

      res.json({
        data: continentes,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erro ao listar continentes:', error);
      res.status(500).json({ error: 'Erro ao listar continentes' });
    }
  }

  // Buscar continente por ID
  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const continente = await prisma.continente.findUnique({
        where: { id: Number(id) },
        include: {
          paises: {
            select: {
              id: true,
              nome: true,
              populacao: true
            }
          }
        }
      });

      if (!continente) {
        return res.status(404).json({ error: 'Continente não encontrado' });
      }

      return res.json(continente);
    } catch (error) {
      console.error('Erro ao buscar continente:', error);
      return res.status(500).json({ error: 'Erro ao buscar continente' });
    }
  }

  // Criar novo continente
  async criar(req: Request, res: Response) {
    try {
      const { nome, descricao } = req.body;

      if (!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }

      const continente = await prisma.continente.create({
        data: { nome, descricao }
      });

      return res.status(201).json(continente);
    } catch (error: any) {
      console.error('Erro ao criar continente:', error);
      
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Já existe um continente com este nome' });
      }
      
      return res.status(500).json({ error: 'Erro ao criar continente' });
    }
  }

  // Atualizar continente
  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;

      const continente = await prisma.continente.update({
        where: { id: Number(id) },
        data: { nome, descricao }
      });

      return res.json(continente);
    } catch (error: any) {
      console.error('Erro ao atualizar continente:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Continente não encontrado' });
      }
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Já existe um continente com este nome' });
      }
      
      return res.status(500).json({ error: 'Erro ao atualizar continente' });
    }
  }

  // Excluir continente
  async excluir(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.continente.delete({
        where: { id: Number(id) }
      });

      return res.status(204).send();
    } catch (error: any) {
      console.error('Erro ao excluir continente:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Continente não encontrado' });
      }
      
      return res.status(500).json({ error: 'Erro ao excluir continente' });
    }
  }
}
