import { z } from "zod";

export const ChallengeSchema = z.object({
  slug: z.string(),
  challenger_slug: z.string(),
  challenged_slug: z.string(),
  type_race: z.enum(["quarter_mile", "loops", "drift"]),
  vehicle_challenger_slug: z.string(),
  vehicle_challenged_slug: z.string(),
  status: z.enum([
    "CREATED",
    "ACCEPTED",
    "REJECTED",
    "CANCELED",
    "STARTED",
    "COMPLETED",
  ]),
  winner_slug: z.string().nullable(),
  locality_rece: z.string(),
  date_race: z.date(),
  notes: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date().optional(),
});
