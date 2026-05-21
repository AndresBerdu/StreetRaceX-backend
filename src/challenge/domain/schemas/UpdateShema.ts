import z from "zod";
import { ChallengeSchema } from "./ChallengeSchema.ts";

export const updateChallengeSchema = ChallengeSchema.extend({
    id: z.string().optional(),
    slug: z.string().optional(),
    challenger_slug: z.string().optional(),
}).partial();

export type updateChallenge = z.infer<typeof updateChallengeSchema>;
