import {
  forbidden,
  notFound,
  unprocessableEntity,
} from "../../main/domain/AppError.ts";

import { failure, success, type Result } from "../../main/domain/Result.ts";

import type { IUserRepository } from "../../user/domain/interfaces/ports/IUserRepository.js";
import type { Challenge } from "../domain/types/Challenge.js";
import type { IChallengeRepository } from "../domain/interfaces/ports/IChallengeRepository.js";

export const create_challenge = (
  challengeRepository: IChallengeRepository,
  userRepository: IUserRepository,
) => {
  return async (data: Challenge): Promise<Result<Challenge>> => {
    if (data.challenger_slug === data.challenged_slug) {
      return failure(unprocessableEntity("You can't challenge yourself"));
    }

    const challenger = await userRepository.get_user_by_slug(data.challenger_slug);
    const challenged = await userRepository.get_user_by_slug(data.challenged_slug);

    const challengerVehicles = await userRepository.get_vehicles_by_user_slug(
      challenger.slug,
    );
    const challengedVehicles = await userRepository.get_vehicles_by_user_slug(
      challenged.slug,
    );

    const challengerActiveVehicle = challengerVehicles.find(
      (v) => v.active === true,
    );
    const challengedActiveVehicle = challengedVehicles.find(
      (v) => v.active === true,
    );

    if (!challengerActiveVehicle) {
      return failure(
        unprocessableEntity("Challenger doesn't have an active vehicle"),
      );
    }

    if (!challengedActiveVehicle) {
      return failure(
        unprocessableEntity("Challenged doesn't have an active vehicle"),
      );
    }

    if (!challenger || !challenged) {
      return failure(notFound("User not exist"));
    }

    const ranks = ["D", "C", "B", "A", "S"];

    const rankA = ranks.indexOf(challenger.rank);
    const rankB = ranks.indexOf(challenged.rank);

    if (rankA === -1 || rankB === -1) {
      return failure(unprocessableEntity("Invalid rank"));
    }

    const diff = Math.abs(rankA - rankB);

    if (diff > 2) {
      return failure(forbidden("Range difference cannot be challenged"));
    }

    const challengeToCreate: Challenge = {
      ...data,
      vehicle_challenger_slug: challengerActiveVehicle.slug,
      vehicle_challenged_slug: challengedActiveVehicle.slug,
    };

    const challenge =
      await challengeRepository.create_challenge(challengeToCreate);

    return success(201, challenge, "Challenge created");
  };
};
