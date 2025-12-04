import { Request, Response } from 'express';
import prisma from '../config/database';

export class CidadeController {
  // Listar todas as cidades
  async listar(req: Request, res: Response) {
    try {
      const { page = '1', limit = '10', paisId, continenteId } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      let where: any = {};
      
      if (paisId) {
        where.paisId = Number(paisId);
      } else if (continenteId) {
        where.pais = {
          continenteId: Number(continenteId)
        };
      }

      const [cidades, total] = await Promise.all([
        prisma.cidade.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            pais: {
              select: {
                id: true,
                nome: true,
                codigoISO: true,
                continente: {
                  select: { id: true, nome: true }
                }
              }
            }
          },
          orderBy: { nome: 'asc' }
        }),
        prisma.cidade.count({ where })
      ]);

      const cidadesJSON = cidades;

      return res.json({
        data: cidadesJSON,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erro ao listar cidades:', error);
      return res.status(500).json({ error: 'Erro ao listar cidades' });
    }
  }

  // Listar cidades por país
  async listarPorPais(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const cidades = await prisma.cidade.findMany({
        where: { paisId: Number(id) },
        orderBy: { nome: 'asc' }
      });

      res.json(cidades);
    } catch (error) {
      console.error('Erro ao listar cidades por país:', error);
      res.status(500).json({ error: 'Erro ao listar cidades' });
    }
  }

  // Listar cidades por continente
  async listarPorContinente(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const cidades = await prisma.cidade.findMany({
        where: {
          pais: {
            continenteId: Number(id)
          }
        },
        include: {
          pais: {
            select: { id: true, nome: true, codigoISO: true }
          }
        },
        orderBy: { nome: 'asc' }
      });

      res.json(cidades);
    } catch (error) {
      console.error('Erro ao listar cidades por continente:', error);
      res.status(500).json({ error: 'Erro ao listar cidades' });
    }
  }

  // Buscar cidade por ID
  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const cidade = await prisma.cidade.findUnique({
        where: { id: Number(id) },
        include: {
          pais: {
            include: {
              continente: true
            }
          },
          visitas: {
            include: {
              usuario: {
                select: { id: true, nome: true }
              }
            }
          }
        }
      });

      if (!cidade) {
        return res.status(404).json({ error: 'Cidade não encontrada' });
      }

      // Converter BigInt para string
      const cidadeJSON = {
        ...cidade,
        pais: {
          ...cidade.pais,
          populacao: cidade.pais.populacao?.toString()
        }
      };

      return res.json(cidadeJSON);
    } catch (error) {
      console.error('Erro ao buscar cidade:', error);
      return res.status(500).json({ error: 'Erro ao buscar cidade' });
    }
  }

  // Criar nova cidade
  async criar(req: Request, res: Response) {
    try {
      const { nome, populacao, latitude, longitude, clima, paisId } = req.body;

      if (!nome || !paisId) {
        return res.status(400).json({ 
          error: 'Nome e paisId são obrigatórios' 
        });
      }

      const cidade = await prisma.cidade.create({
        data: {
          nome,
          populacao: populacao ? Number(populacao) : undefined,
          latitude: latitude ? parseFloat(latitude) : undefined,
          longitude: longitude ? parseFloat(longitude) : undefined,
          clima: clima || undefined,
          paisId: Number(paisId)
        },
        include: {
          pais: {
            include: {
              continente: true
            }
          }
        }
      });

      // Converter BigInt do país para string
      const cidadeJSON = {
        ...cidade,
        pais: {
          ...cidade.pais,
          populacao: cidade.pais.populacao?.toString()
        }
      };

      return res.status(201).json(cidadeJSON);
    } catch (error: any) {
      console.error('Erro ao criar cidade:', error);
      console.error('Detalhes do erro:', {
        code: error.code,
        message: error.message,
        meta: error.meta
      });
      
      if (error.code === 'P2003') {
        return res.status(400).json({ error: 'País não encontrado' });
      }
      
      return res.status(500).json({ 
        error: 'Erro ao criar cidade',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Atualizar cidade
  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, populacao, latitude, longitude, clima, paisId } = req.body;

      const cidade = await prisma.cidade.update({
        where: { id: Number(id) },
        data: {
          nome,
          populacao: populacao ? Number(populacao) : null,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          clima,
          paisId: paisId ? Number(paisId) : undefined
        },
        include: {
          pais: {
            include: {
              continente: true
            }
          }
        }
      });

      // Converter BigInt para string
      const cidadeJSON = {
        ...cidade,
        pais: {
          ...cidade.pais,
          populacao: cidade.pais.populacao?.toString()
        }
      };

      return res.json(cidadeJSON);
    } catch (error: any) {
      console.error('Erro ao atualizar cidade:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Cidade não encontrada' });
      }
      if (error.code === 'P2003') {
        return res.status(400).json({ error: 'País não encontrado' });
      }
      
      return res.status(500).json({ error: 'Erro ao atualizar cidade' });
    }
  }

  // Excluir cidade
  async excluir(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.cidade.delete({
        where: { id: Number(id) }
      });

      return res.status(204).send();
    } catch (error: any) {
      console.error('Erro ao excluir cidade:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Cidade não encontrada' });
      }
      
      return res.status(500).json({ error: 'Erro ao excluir cidade' });
    }
  }
}
