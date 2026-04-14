export type Chanllenge = {
  id: string;
  challenger_id: string;
  challenged_id: string;
  type_race: Type_race;
  vehicle_challenger_id: string;
  vehicle_challenged_id: string;
  state: State;
  winner: string;
  race_location: string;
  race_date: Date;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type Type_race = "quarter_mile" | "loops" | "drif";

export type State =
  | "pending"
  | "accepted"
  | "rejected"
  | "in_progress"
  | "completed"
  | "cancel";
