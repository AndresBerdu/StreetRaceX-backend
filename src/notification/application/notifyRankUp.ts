import { forbidden, notFound } from "../../main/domain/AppError.ts";
import { failure, success } from "../../main/domain/Result.ts";
import type { IUserRepository } from "../../user/domain/interfaces/ports/IUserRepository.js";
import type { INotificationRepository } from "../domain/interfaces/ports/INotificationRepository.js";

const NEXT_RANK: Record<string, string | null> = {
  D: "C",
  C: "B",
  B: "A",
  A: "S",
  S: null,
};

export const updateUserRank =
  (
    userRepository: IUserRepository,
    notificationRepository: INotificationRepository,
  ) =>
  async (slug: string, newRank: string) => {
    const user = await userRepository.get_user_by_slug(slug);

    if (!user) return failure(notFound("User"));

    if (user.rank === newRank)
      return failure(forbidden("You can't update to same rank"));

    const current = user.rank;
    const allowedNext = NEXT_RANK[current];

    if (allowedNext === undefined) {
      return failure(
        forbidden("Current rank is invalid or not allowed to change"),
      );
    }

    if (allowedNext === null || newRank !== allowedNext) {
      return failure(
        forbidden(
          "Invalid rank transition. Only promotion by one level is allowed.",
        ),
      );
    }

    const updatedUser = await userRepository.update_user_by_slug(slug, {
      rank: newRank,
    });

    await notificationRepository.notifyRankUp(slug, newRank);

    return success(200, updatedUser, "User rank updated");
  };
