import type { Challenge } from "../Challenge.js";

export interface IChallengeRepository {
  get_challge_by_slug(id: string): Primise<Challenge | null>;
  create_challenge(challenge: Challenge): Promise<Challenge>
}
