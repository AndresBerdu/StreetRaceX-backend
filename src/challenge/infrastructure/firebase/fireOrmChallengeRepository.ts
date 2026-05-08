import { getRepository } from "fireorm";
import { ChallengeModel } from "./ChallengeModel.ts";
import type { IChallengeRepository } from "../../domain/interfaces/ports/IChallengeRepository.js";
import { v4 as uuidv4 } from "uuid";
import type { Challenge } from "../../domain/interfaces/Challenge.js";

const challengeRepository = getRepository(ChallengeModel);

export const fireOrmChallengeRepository = (): IChallengeRepository => ({
  async getById(id) {
    try {
      return await challengeRepository.findById(id);
    } catch {
      return null;
    }
  },

  async createChallenge(data) {
    const model = new ChallengeModel();

    Object.assign(model, data);

    model.id = uuidv4();
    model.created_at = new Date();
    model.updated_at = new Date();

    return await challengeRepository.create(model);
  },

  async updateChallenge(id, data) {
    try {
      const existing = await challengeRepository.findById(id);
      if (!existing) return null;

      Object.assign(existing, data, {
        updated_at: new Date(),
      });

      return await challengeRepository.update(existing);
    } catch {
      return null;
    }
  },

  findById: function (id: string): Promise<Challenge | null> {
    throw new Error("Function not implemented.");
  },
});
