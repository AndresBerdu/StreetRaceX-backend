import { Collection } from "fireorm";

@Collection("challenge")
export class ChallengeModel {
  id!: string;
  challenger_id!: string;
  challenged_id!: string;
  type_race!: string;
  vehicle_challenger_id!: string;
  vehicle_challenged_id!: string;
  state!: string;
  winner!: string;
  race_location!: string;
  race_date!: Date;
  notes!: string;
  created_at!: Date;
  updated_at!: Date;
}