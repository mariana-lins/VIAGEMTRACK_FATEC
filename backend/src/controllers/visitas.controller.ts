import { Request, Response } from 'express';
import prisma from '../config/database';

export class VisitaController {
  // Listar visitas do usuário
  async listarPorUsuario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { page = '1', limit = '20' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const [visitas, total] = await Promise.all([
        prisma.visita.findMany({
          where: { usuarioId: Number(id) },
          skip,
          take: Number(limit),
          include: {
            cidade: {
              include: {
                pais: {
                  include: {
                    continente: true
                  }
                }
              }
            }
          },
          orderBy: { dataVisita: 'desc' }
        }),
        prisma.visita.count({ where: { usuarioId: Number(id) } })
      ]);

      // Converter BigInt para string
      const visitasJSON = visitas.map(visita => ({
        ...visita,
        cidade: {
          ...visita.cidade,
          pais: {
            ...visita.cidade.pais,
            populacao: visita.cidade.pais.populacao?.toString()
          }
        }
      }));

      res.json({
        data: visitasJSON,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erro ao listar visitas:', error);
      res.status(500).json({ error: 'Erro ao listar visitas' });
    }
  }

  // Registrar nova visita
  async criar(req: Request, res: Response) {
    try {
      const { usuarioId, cidadeId, dataVisita, comentario } = req.body;

      if (!usuarioId || !cidadeId) {
        return res.status(400).json({ error: 'usuarioId e cidadeId são obrigatórios' });
      }

      // Verificar se a visita já existe
      const visitaExiste = await prisma.visita.findUnique({
        where: {
          usuarioId_cidadeId: {
            usuarioId: Number(usuarioId),
            cidadeId: Number(cidadeId)
          }
        }
      });

      if (visitaExiste) {
        return res.status(400).json({ error: 'Esta cidade já foi registrada como visitada' });
      }

      const visita = await prisma.visita.create({
        data: {
          usuarioId: Number(usuarioId),
          cidadeId: Number(cidadeId),
          dataVisita: dataVisita ? new Date(dataVisita) : new Date(),
          comentario
        },
        include: {
          cidade: {
            include: {
              pais: {
                include: {
                  continente: true
                }
              }
            }
          }
        }
      });

      // Converter BigInt do país para string
      const visitaJSON = {
        ...visita,
        cidade: {
          ...visita.cidade,
          pais: {
            ...visita.cidade.pais,
            populacao: visita.cidade.pais.populacao?.toString()
          }
        }
      };

      return res.status(201).json(visitaJSON);
    } catch (error: any) {
      console.error('Erro ao registrar visita:', error);
      
      if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Usuário ou cidade não encontrados' });
      }
      
      return res.status(500).json({ error: 'Erro ao registrar visita' });
    }
  }

  // Atualizar visita (comentário, data)
  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { dataVisita, comentario } = req.body;

      const visita = await prisma.visita.update({
        where: { id: Number(id) },
        data: {
          dataVisita: dataVisita ? new Date(dataVisita) : undefined,
          comentario
        },
        include: {
          cidade: {
            include: {
              pais: true
            }
          }
        }
      });

      // Converter BigInt para string
      const visitaJSON = {
        ...visita,
        cidade: {
          ...visita.cidade,
          pais: {
            ...visita.cidade.pais,
            populacao: visita.cidade.pais.populacao?.toString()
          }
        }
      };

      return res.json(visitaJSON);
    } catch (error: any) {
      console.error('Erro ao atualizar visita:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Visita não encontrada' });
      }
      
      return res.status(500).json({ error: 'Erro ao atualizar visita' });
    }
  }

  // Excluir visita
  async excluir(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.visita.delete({
        where: { id: Number(id) }
      });

      return res.status(204).send();
    } catch (error: any) {
      console.error('Erro ao excluir visita:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Visita não encontrada' });
      }
      
      return res.status(500).json({ error: 'Erro ao excluir visita' });
    }
  }

  // Verificar se cidade foi visitada pelo usuário
  async verificarVisita(req: Request, res: Response) {
    try {
      const { usuarioId, cidadeId } = req.params;

      const visita = await prisma.visita.findUnique({
        where: {
          usuarioId_cidadeId: {
            usuarioId: Number(usuarioId),
            cidadeId: Number(cidadeId)
          }
        }
      });

      res.json({ visitada: !!visita, visita });
    } catch (error) {
      console.error('Erro ao verificar visita:', error);
      res.status(500).json({ error: 'Erro ao verificar visita' });
    }
  }
}
