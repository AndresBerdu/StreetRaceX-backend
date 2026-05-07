import { Router } from 'express';
import { ChallengeController } from "../controllers/challenge.controller.ts"

const router = Router();
const controller = new ChallengeController();

//Crear reto
router.post('/', controller.create);

//Aceptar
router.post('/:id/accept', controller.accept);

//Rechazar
router.post('/:id/reject', controller.reject);

//Iniciar
router.post('/:id/start', controller.start);

//Completar
router.post('/:id/complete', controller.complete);

//Cancelar
router.post('/:id/cancel', controller.cancel);

export default router;