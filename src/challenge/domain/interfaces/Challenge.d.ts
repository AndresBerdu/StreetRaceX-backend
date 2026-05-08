export type ChallengeStatus =
  | "CREATED"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELED"
  | "STARTED"
  | "COMPLETED";

export type Type_race = "quarter_mile" | "loops" | "drif";

export type State =
  | "pending"
  | "accepted"
  | "rejected"
  | "in_progress"
  | "completed"
  | "cancel";

export interface Challenge {
  id?: string;
  title: string;
  description: string;
  reward: number;
  userId: string;
  challenger_id: string;
  challenged_id: string;
  vehicle_challenger_id: string;
  vehicle_challenged_id: string;
  status: ChallengeStatus;
  createdAt: Date;
  updatedAt?: Date;
}
