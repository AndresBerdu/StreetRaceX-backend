import { ChallengeStatus } from '../domain/Challenge.js';
import { createChallengeSchema } from '../domain/schemas/challenge.schemas.ts';


export class CreateChallengeUseCase {
  constructor(
    private readonly challengeRepo: any,
    private readonly userRepo: any,
  ) {}

  async execute(input: unknown) {
    const data = createChallengeSchema.parse(input);

    if (data.retador_id === data.retado_id) {
      throw new Error('No puedes retarte a ti mismo');
    }

    const [retador, retado] = await Promise.all([
      this.userRepo.findById(data.retador_id),
      this.userRepo.findById(data.retado_id),
    ]);

    if (!retador || !retado) {
      throw new Error('Usuarios inválidos');
    }

    //regla clave: rango
    const diff = Math.abs(retador.rank - retado.rank);

    if (diff > 2) {
      throw new Error('Diferencia de rango no permitida');
    }

    //evitar retos activos
    const active = await this.challengeRepo.findActiveByUserIds([
      data.retador_id,
      data.retado_id,
    ]);

    if (active) {
      throw new Error('Uno de los usuarios ya tiene un reto activo');
    }

    return this.challengeRepo.create({
      ...data,
      estado: ChallengeStatus.PENDIENTE,
    });
  }
}