import { getRepository } from "fireorm";
import type { IChallengeRepository } from "../../domain/interfaces/ports/IChallengeRepository.js";
import { ChallengeModel } from "./ChallengeModel.ts";
import { v4 as uuidv4 } from "uuid";

const challengeRepository = getRepository(ChallengeModel);

export const fireOrmChallenge = (): IChallengeRepository => ({
  async get_challge_by_slug(id) {
    return await challengeRepository.findById(id);
  },

  async create_challenge(challenge) {
    const challengeModel = new ChallengeModel();

    Object.assign(challengeModel, challenge);

    challengeModel.id = uuidv4();

    return await challengeRepository.create(challengeModel);
  },
});
