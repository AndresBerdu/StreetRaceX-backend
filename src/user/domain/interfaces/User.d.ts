import type { Category } from "../../../category/domain/Category.js";

export type User = {
  id?: string;
  username: string;
  email: string;
  password: string;
  profile_photo: string;
  locality: Locality;
  rank: string;
  victories: number;
  defeats: number;
  consecutive_victories: number;
  state: string;
  updated_at: Date;
  created_at: Date;
};

export type Locality = {
  zone_localicity: string;
  zone_city: string;
  zone_state: string;
  zone_country: string;
};

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
