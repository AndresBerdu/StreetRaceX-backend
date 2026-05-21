import { getRepository } from "fireorm";
import { ChallengeModel } from "./ChallengeModel.ts";
import type { IChallengeRepository } from "../../../domain/interfaces/ports/IChallengeRepository.js";
import { v4 as uuidv4 } from "uuid";

const challengeRepository = getRepository(ChallengeModel);

export const fireOrmChallengeRepository = (): IChallengeRepository => ({
  async get_challenge_by_slug(slug) {
    const challenge = await challengeRepository
      .whereEqualTo("slug", slug)
      .findOne();
    return challenge;
  },

  async create_challenge(data) {
    const model = new ChallengeModel();

    Object.assign(model, data);

    model.id = uuidv4();
    model.created_at = new Date();
    model.updated_at = new Date();

    return await challengeRepository.create(model);
  },

  async update_challenge(slug, data) {
    const challenge = await challengeRepository
      .whereEqualTo("slug", slug)
      .findOne();

    Object.assign(challenge!, data);

    return await challengeRepository.update(challenge!);
  },
});
