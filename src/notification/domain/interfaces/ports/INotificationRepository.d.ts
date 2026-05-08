export interface INotificationRepository {
  notifyNewChallenge(
    userSlug: string,
    challengeId: string,
    fromSlug: string,
  ): Promise<void>;
  notifyChallengeUpdate(
    userSlug: string,
    challengeId: string,
    status: "accepted" | "rejected" | "completed",
  ): Promise<void>;
  notifyRankUp(userSlug: string, newRank: string): Promise<void>;
}
