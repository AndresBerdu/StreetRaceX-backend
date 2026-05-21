export enum ChallengeStatus {
  CREATED = "CREATED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
  STARTED = "STARTED",
  COMPLETED = "COMPLETED",
}

export enum TypeRace {
  QUARTER_MILE = "quarter_mile",
  LOOPS = "loops",
  DRIFT = "drift",
}

export type Challenge = {
  id?: string;
  slug: string;
  challenger_slug: string;
  challenged_slug: string;
  type_race: TypeRace;
  vehicle_challenger_slug: string;
  vehicle_challenged_slug: string;
  status: ChallengeStatus;
  winner_slug: string | null;
  locality_rece: string;
  date_race: Date;
  notes?: string;
  created_at: Date;
  updated_at?: Date;
}
