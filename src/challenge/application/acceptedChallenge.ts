import { notFound, unprocessableEntity } from "../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../main/domain/Result.ts";
import type { IChallengeRepository } from "../domain/interfaces/ports/IChallengeRepository.js";
import type { Challenge } from "../domain/interfaces/Challenge.js";

export const accept_challenge = (challengeRepository: IChallengeRepository) => {
  return async (id: string): Promise<Result<Challenge>> => {

    const challenge = await challengeRepository.getById(id);

    if (!challenge) {
      return failure(notFound("Challenge not found"));
    }

    if (challenge.status !== "CREATED") {
      return failure(unprocessableEntity("Challenge cannot be accepted"));
    }

    const updated = await challengeRepository.updateChallenge(id, {
      status: "ACCEPTED",
      updatedAt: new Date(),
    });

    return success(200, updated, "Challenge accepted");
  };
};