import { z } from "zod";

export const LocalitySchema = z.object({
  zone_localicity: z.string(),
  zone_city: z.string(),
  zone_state: z.string(),
  zone_country: z.string(),
});

export type Locality = z.infer<typeof LocalitySchema>;