import { ChallengeStatus } from '../domain/interfaces/Challenge.js';

export class CompleteChallengeUseCase {
  constructor(
    private readonly challengeRepo: any,
    private readonly rankingService: any,
  ) {}

  async execute(challengeId: string, ganador_id: string) {
    const challenge = await this.challengeRepo.findById(challengeId);

    if (!challenge) throw new Error('Reto no encontrado');

    if (challenge.estado !== ChallengeStatus.EN_CURSO) {
      throw new Error('El reto no está en curso');
    }

    if (
      ganador_id !== challenge.retador_id &&
      ganador_id !== challenge.retado_id
    ) {
      throw new Error('Ganador inválido');
    }

    const updated = await this.challengeRepo.update(challengeId, {
      estado: ChallengeStatus.COMPLETADO,
      ganador_id,
    });

    //CORE DEL NEGOCIO
    await this.rankingService.update(
      challenge.retador_id,
      challenge.retado_id,
      ganador_id,
    );

    return updated;
  }
}