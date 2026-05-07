import { ChallengeStatus } from "../domain/Challenge.js";

export class AcceptChallengeUseCase {
  constructor(private readonly challengeRepo: any) {}

  async execute(challengeId: string, userId: string) {
    const challenge = await this.challengeRepo.findById(challengeId);

    if (!challenge) throw new Error('Reto no encontrado');

    if (challenge.retado_id !== userId) {
      throw new Error('No autorizado');
    }

    if (challenge.estado !== ChallengeStatus.PENDIENTE) {
      throw new Error('El reto no está pendiente');
    }

    return this.challengeRepo.update(challengeId, {
      estado: ChallengeStatus.ACEPTADO,
    });
  }
}