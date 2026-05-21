import { Collection } from "fireorm";
import type { ChallengeStatus, TypeRace } from "../../../domain/types/Challenge.ts";

@Collection("challenge")
export class ChallengeModel {
  id!: string;
  slug!: string;
  challenger_slug!: string;
  challenged_slug!: string;
  type_race!: TypeRace;
  vehicle_challenger_slug!: string;
  vehicle_challenged_slug!: string;
  status!: ChallengeStatus;
  winner_slug!: string;
  locality_rece!: string;
  date_race!: Date;
  notes!: string;
  created_at!: Date;
  updated_at!: Date;
}