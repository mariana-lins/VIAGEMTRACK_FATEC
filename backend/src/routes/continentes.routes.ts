import { Router } from 'express';
import { ContinenteController } from '../controllers/continentes.controller';

const router = Router();
const controller = new ContinenteController();

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);

export default router;
