import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

export class UsuarioController {
  // Registrar novo usuário
  async registrar(req: Request, res: Response) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      }

      // Verificar se email já existe
      const usuarioExiste = await prisma.usuario.findUnique({
        where: { email }
      });

      if (usuarioExiste) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);

      const usuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senhaHash
        },
        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true
        }
      });

      return res.status(201).json(usuario);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  }

  // Login
  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { email },
        include: {
          _count: {
            select: { visitas: true }
          }
        }
      });

      if (!usuario) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          _count: usuario._count
        }
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  // Buscar perfil do usuário
  async perfil(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const usuario = await prisma.usuario.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true,
          _count: {
            select: { visitas: true }
          }
        }
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json(usuario);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
  }
}
