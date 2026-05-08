import {
  alreadyExist,
  forbidden,
  notFound,
  unprocessableEntity,
} from "../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../main/domain/Result.ts";
import type { IUserRepository } from "../../user/domain/interfaces/ports/IUserRepository.js";
import type { Challenge } from "../domain/interfaces/Challenge.js";
import type { IChallengeRepository } from "../domain/interfaces/ports/IChallengeRepository.js";

export const create_challenge = (
  challengeRepository: IChallengeRepository,
  userRepository: IUserRepository,
) => {
  return async (data: Challenge): Promise<Result<Challenge>> => {
    const challenger = await userRepository.get_user_by_id(data.challenger_id);
    const challenged = await userRepository.get_user_by_id(data.challenged_id);

    if (challenger === data.challenged_id)
      return failure(unprocessableEntity("you can’t challenge yourself"));

    if (data.challenger_id === data.challenged_id) {
      return failure(notFound("User not exist"));
    }

    //regla clave: rango
    const ranks = ["D", "C", "B", "A", "S"];
    const rankA = ranks.indexOf(challenger.rank);
    const rankB = ranks.indexOf(challenged.rank);
    const diff = Math.abs(rankA - rankB);

    if (diff > 2)
      return failure(forbidden("Range difference cannot be challenged"));

    const challenge = await challengeRepository.create_challenge(data);

    return success(201, challenge, "Challenge created");
  };
};
