import { notFound, unprocessableEntity } from "../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../main/domain/Result.ts";
import type { IChallengeRepository } from "../domain/interfaces/ports/IChallengeRepository.js";
import { ChallengeStatus, type Challenge } from "../domain/types/Challenge.ts";
import type { updateChallenge } from "../domain/schemas/UpdateShema.ts";

export const update_challenge = (challengeRepository: IChallengeRepository) => {
  return async (
    slug: string,
    data: updateChallenge,
  ): Promise<Result<Challenge>> => {
    const challengeExist =
      await challengeRepository.get_challenge_by_slug(slug);

    /* validation if challenge don't exist */
    if (!challengeExist) return failure(notFound("challenge not found"));

    /* accepted challenge */

    if (
      challengeExist.status === ChallengeStatus.CREATED &&
      data.status === ChallengeStatus.ACCEPTED
    ) {
      const updated = await challengeRepository.update_challenge(slug, data);

      return success(200, updated, "challenge accepted");
    }

    /* rejected challenge */

    if (
      challengeExist.status === ChallengeStatus.CREATED &&
      data.status === ChallengeStatus.REJECTED
    ) {
      const updated = await challengeRepository.update_challenge(slug, data);

      return success(200, updated, "challenge rejected");
    }

    /* canceled challenge */

    if (
      (challengeExist.status === ChallengeStatus.CREATED ||
        challengeExist.status === ChallengeStatus.ACCEPTED ||
        challengeExist.status === ChallengeStatus.STARTED) &&
      data.status === ChallengeStatus.CANCELED
    ) {
      const updated = await challengeRepository.update_challenge(slug, data);

      return success(200, updated, "challenge canceled");
    }

    /* started challenge */

    if (
      challengeExist.status === ChallengeStatus.ACCEPTED &&
      data.status === ChallengeStatus.STARTED
    ) {
      const updated = await challengeRepository.update_challenge(slug, data);

      return success(200, updated, "challenge started");
    }

    /* completed challenge */

    if (
      challengeExist.status === ChallengeStatus.STARTED &&
      data.status === ChallengeStatus.COMPLETED
    ) {
      const updated = await challengeRepository.update_challenge(slug, data);

      return success(200, updated, "challenge completed");
    }

    /* validation if challenge status is valid */

    const isValidValue = Object.values(ChallengeStatus).includes(
      data.status as ChallengeStatus,
    );

    if (data.status && !isValidValue) {
      return failure(unprocessableEntity("invalid status value"));
    }

    /* validation if one field is forbbiden  */
    if (
      data.id ||
      data.slug ||
      data.challenged_slug ||
      data.challenger_slug ||
      data.vehicle_challenged_slug ||
      data.vehicle_challenger_slug
    ) {
      return failure(
        unprocessableEntity(
          "id, slug, challenged_slug, challenger_slug, vehicle_challenged_slug, vehicle_challenger_slug cannot be updated",
        ),
      );
    }

    /* validation if challenge status is valid */

    if (
      (challengeExist.status === ChallengeStatus.ACCEPTED ||
        challengeExist.status === ChallengeStatus.CANCELED ||
        challengeExist.status === ChallengeStatus.COMPLETED ||
        challengeExist.status === ChallengeStatus.STARTED ||
        challengeExist.status === ChallengeStatus.REJECTED) &&
      data.status === ChallengeStatus.CREATED
    ) {
      return failure(
        unprocessableEntity("challenge cannot be updated to created"),
      );
    }

    const updatedChallenge = await challengeRepository.update_challenge(
      slug,
      data,
    );

    return success(200, updatedChallenge, "challenge updated successfully");
  };
};
