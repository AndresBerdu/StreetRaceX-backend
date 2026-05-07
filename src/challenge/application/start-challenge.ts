import { ChallengeStatus } from "../domain/Challenge.js";

export class StartChallengeUseCase {
  constructor(private readonly challengeRepo: any) {}

  async execute(challengeId: string) {
    const challenge = await this.challengeRepo.findById(challengeId);

    if (!challenge) throw new Error('Reto no encontrado');

    if (challenge.estado !== ChallengeStatus.ACEPTADO) {
      throw new Error('El reto no está aceptado');
    }

    return this.challengeRepo.update(challengeId, {
      estado: ChallengeStatus.EN_CURSO,
    });
  }
}