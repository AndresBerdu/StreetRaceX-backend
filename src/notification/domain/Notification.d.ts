export type Notification = {
  id: string;
  user_id: string;
  type: Type;
  message: string;
  road: boolean;
  reference_id: string;
  created_at: string;
};

export type Type =
  | "challenge_received"
  | "challenge_rejected"
  | "results"
  | "rank_up";
