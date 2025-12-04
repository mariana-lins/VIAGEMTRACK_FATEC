import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarios.controller';

const router = Router();
const controller = new UsuarioController();

router.post('/registrar', controller.registrar);
router.post('/login', controller.login);
router.get('/:id', controller.perfil);

export default router;
