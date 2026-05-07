import type { ChallengeStatus, TipoCarrera } from "../Challenge.js";

export interface Challenge {
  id: string;

  retador_id: string;
  retado_id: string;

  tipo_carrera: TipoCarrera;

  vehiculo_retador_id: string;
  vehiculo_retado_id?: string | null;

  estado: ChallengeStatus;

  ganador_id?: string | null;

  ubicacion_acordada: string;
  fecha_acordada: Date;

  notas?: string | null;

  created_at: Date;
  updated_at: Date;
}