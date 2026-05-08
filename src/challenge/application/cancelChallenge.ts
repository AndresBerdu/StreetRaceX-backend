import type { Challenge } from "../domain/interfaces/Challenge.js";
import type { IChallengeRepository } from "../domain/interfaces/ports/IChallengeRepository.js";

import { failure, success, type Result } from "../../main/domain/Result.ts";
import { notFound, unprocessableEntity } from "../../main/domain/AppError.ts";

export const cancel_challenge = (challengeRepository: IChallengeRepository) => {
  return async (id: string): Promise<Result<Challenge>> => {

    const challenge = await challengeRepository.getById(id);

    if (!challenge) {
      return failure(notFound("Challenge not found"));
    }

    if (!["CREATED", "ACCEPTED"].includes(challenge.status)) {
      return failure(unprocessableEntity("Cannot cancel challenge"));
    }

    const updated = await challengeRepository.updateChallenge(id, {
      status: "CANCELED",
      updatedAt: new Date(),
    });

    return success(200, updated, "Challenge canceled");
  };
};