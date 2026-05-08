import { Collection } from "fireorm";
import type { State, Type_race } from "../../domain/interfaces/Challenge.js";

@Collection("challenge")
export class ChallengeModel {
  id!: string;
  challenger_id!: string;
  challenged_id!: string;
  type_race!: Type_race;
  vehicle_challenger_id!: string;
  vehicle_challenged_id!: string;
  state!: State;
  winner!: string;
  race_location!: string;
  race_date!: Date;
  notes!: string;
  created_at!: Date;
  updated_at!: Date;
}