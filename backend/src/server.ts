import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Importar rotas
import continentesRoutes from './routes/continentes.routes';
import paisesRoutes from './routes/paises.routes';
import cidadesRoutes from './routes/cidades.routes';
import visitasRoutes from './routes/visitas.routes';
import usuariosRoutes from './routes/usuarios.routes';
import externalRoutes from './routes/external.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de log de requisições em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Rota de health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'VIAGEMTRACK API está rodando!',
    timestamp: new Date().toISOString()
  });
});

// Rotas da API
app.use('/api/continentes', continentesRoutes);
app.use('/api/paises', paisesRoutes);
app.use('/api/cidades', cidadesRoutes);
app.use('/api/visitas', visitasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/external', externalRoutes);

// Rota 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware de tratamento de erros
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});

export default app;
