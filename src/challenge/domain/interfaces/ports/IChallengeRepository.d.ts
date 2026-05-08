import { Challenge } from "../interfaces/challenge.interface";

export interface IChallengeRepository {
  createChallenge: (data: Challenge) => Promise<Challenge>; 
  getById: (id: string) => Promise<Challenge | null>;
  findById: (id: string) => Promise<Challenge | null>;
  updateChallenge: (id: string, data: Partial<Challenge>) => Promise<Challenge>;
}