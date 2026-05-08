export type ChallengeStatus =
  | "CREATED"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELED"
  | "STARTED"
  | "COMPLETED";

export interface Challenge {
  id?: string;
  title: string;
  description: string;
  reward: number;
  userId: string;

  challenger_id: string;
  challenged_id: string;

  status: ChallengeStatus;

  createdAt: Date;
  updatedAt?: Date;
}