import { Collection } from "fireorm";
import type { Locality } from "../../domain/interfaces/User.js";

export const Rank = {
  S: "S",
  A: "A",
  B: "B",
  C: "C",
  D: "D",
} as const;

export const State = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
} as const;

@Collection("users")
export class UserModel {
  id!: string;
  slug!: string;
  username!: string;
  email!: string;
  password!: string;
  profile_photo!: string;
  locality!: Locality;
  rank!: string;
  victories!: number;
  defeats!: number;
  consecutive_victories!: number;
  state!: string;
  created_at!: Date;
  updated_at!: Date;
}
