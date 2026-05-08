import { z } from "zod";

export const createChallengeSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  reward: z.number().positive(),
  userId: z.string(),
});