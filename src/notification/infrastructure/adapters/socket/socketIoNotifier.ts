import type { Server } from "socket.io";
import type { INotificationRepository } from "../../../domain/interfaces/ports/INotificationRepository.js";

export const socketIoNotifierRepository = (
  io: Server,
): INotificationRepository => ({
  async notifyRankUp(userSlug, newRank) {
    io.to(userSlug).emit("rank:up", {
      eventType: "rank:up",
      timestamp: Date.now(),
      data: { newRank },
      message: `¡Congratulations! You’ve been promoted to ${newRank}`,
    });
  },
  async notifyChallengeUpdate(userSlug, challengeId, status) {},
  async notifyNewChallenge(userSlug, challengeId, fromSlug) {},
});
