import type { Challenge } from "../domain/interfaces/Challenge.js";
import type { IChallengeRepository } from "../domain/interfaces/ports/IChallengeRepository.js";

import { failure, success, type Result } from "../../main/domain/Result.ts";
import { notFound, unprocessableEntity } from "../../main/domain/AppError.ts";


export const complete_challenge = (challengeRepository: IChallengeRepository) => {
  return async (id: string): Promise<Result<Challenge>> => {

    const challenge = await challengeRepository.getById(id);

    if (!challenge) {
      return failure(notFound("Challenge not found"));
    }

    if (challenge.status !== "STARTED") {
      return failure(unprocessableEntity("Challenge must be started first"));
    }

    const updated = await challengeRepository.updateChallenge(id, {
      status: "COMPLETED",
      updatedAt: new Date(),
    });

    return success(200, updated, "Challenge completed");
  };
};