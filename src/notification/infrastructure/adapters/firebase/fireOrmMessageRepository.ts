import { getRepository } from "fireorm";
import type { INotificationRepository } from "../../../domain/interfaces/ports/INotificationRepository.js";
import { MessageModel } from "./MessageMode.ts";
import { UserModel } from "../../../../user/infrastructure/firebase/UserModel.ts";

const notificationFireRepository = getRepository(MessageModel);
const userFireRepository = getRepository(UserModel);

export const fireOrmMessageRepository = (): INotificationRepository => ({
  async notifyChallengeUpdate(userSlug, challengeId, status) {},

  async notifyNewChallenge(userSlug, challengeId, fromSlug) {},

  async notifyRankUp(userSlug, newRank) {
    const user = await userFireRepository
      .whereEqualTo("slug", userSlug)
      .findOne();
    Object.assign(user!, newRank);
    await userFireRepository.update(user!);
  },
});
