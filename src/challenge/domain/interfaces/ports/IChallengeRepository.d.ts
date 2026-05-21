import { Challenge } from "../interfaces/challenge.interface";

export interface IChallengeRepository {
  get_challenge_by_slug: (slug: string) => Promise<Challenge | null>;
  create_challenge: (data: Challenge) => Promise<Challenge>;
  update_challenge: (
    slug: string,
    data: Partial<Challenge>,
  ) => Promise<Challenge>;
}
