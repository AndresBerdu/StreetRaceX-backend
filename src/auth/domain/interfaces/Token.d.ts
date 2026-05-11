import type { Locality } from "../../../user/domain/interfaces/User.ts";

export type Token = {
  username: string;
  email: string;
  locality: Locality;
  role: string;
  slug: string;
}