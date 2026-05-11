import { Collection } from "fireorm";
import type { Locality, Rank, Role, State } from "../../../domain/interfaces/User.ts";

@Collection("users")
export class UserModel {
  id!: string;
  slug!: string;
  username!: string;
  email!: string;
  password!: string;
  profile_photo!: string;
  public_id_photo!: string;
  locality!: Locality;
  role!: Role;
  rank!: Rank;
  victories!: number;
  defeats!: number;
  consecutive_victories!: number;
  state!: State;
  updated_at!: Date;
  created_at!: Date;
}