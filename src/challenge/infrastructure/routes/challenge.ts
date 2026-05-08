import { Router } from 'express';
import { createChallenge } from "../controllers/challengeController.ts"

const router = Router();

//Crear reto
router.post('/', createChallenge);

export default router;