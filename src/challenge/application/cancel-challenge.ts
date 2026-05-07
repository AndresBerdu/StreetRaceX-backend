import { ChallengeStatus } from "../domain/Challenge.js";

export class CancelChallengeUseCase {
  constructor(private readonly challengeRepo: any) {}

  async execute(challengeId: string, userId: string) {
    const challenge = await this.challengeRepo.findById(challengeId);

    if (!challenge) throw new Error('Reto no encontrado');

    if (
      challenge.retador_id !== userId &&
      challenge.retado_id !== userId
    ) {
      throw new Error('No autorizado');
    }

    if (challenge.estado === ChallengeStatus.COMPLETADO) {
      throw new Error('No se puede cancelar un reto completado');
    }

    return this.challengeRepo.update(challengeId, {
      estado: ChallengeStatus.CANCELADO,
    });
  }
}