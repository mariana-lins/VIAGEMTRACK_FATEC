import { Router } from 'express';
import { VisitaController } from '../controllers/visitas.controller';

const router = Router();
const controller = new VisitaController();

router.get('/usuario/:id', controller.listarPorUsuario);
router.get('/verificar/:usuarioId/:cidadeId', controller.verificarVisita);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);

export default router;
