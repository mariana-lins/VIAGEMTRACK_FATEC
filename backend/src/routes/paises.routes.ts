import { Router } from 'express';
import { PaisController } from '../controllers/paises.controller';

const router = Router();
const controller = new PaisController();

// Rotas específicas primeiro para evitar conflitos
router.get('/continente/:id', controller.listarPorContinente);
router.get('/:id', controller.buscarPorId);
router.get('/', controller.listar);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);

export default router;
