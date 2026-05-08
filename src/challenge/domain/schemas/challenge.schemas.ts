import { z } from 'zod';
import { TipoCarrera } from '../interfaces/Challenge.js';

export const createChallengeSchema = z.object({
  retador_id: z.string().uuid(),
  retado_id: z.string().uuid(),

  tipo_carrera: z.nativeEnum(TipoCarrera),

  vehiculo_retador_id: z.string().uuid(),

  ubicacion_acordada: z.string().min(3),
  fecha_acordada: z.coerce.date(),

  notas: z.string().optional(),
});