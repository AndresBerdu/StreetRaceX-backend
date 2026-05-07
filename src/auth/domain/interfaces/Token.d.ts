import type { Locality } from "../../../user/domain/interfaces/User.js";

export type Token = {
  username: string;
  email: string;
  locality: Locality;
  role: string;
  slug: string;
}