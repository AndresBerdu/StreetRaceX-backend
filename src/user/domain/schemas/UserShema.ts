import z from "zod";
import { LocalitySchema } from "./LocalitySchema.ts";

export const UserShema = z.object({
  username: z.string().min(2, "minus 2 caracteres in username"),
  email: z.string().email("The email must be a format email"),
  profile_photo: z
    .string()
    .regex(/\.(jpg|jpeg|png)$/i, "only you can send png or jpg/jpeg images")
    .nullable()
    .optional(),
  password: z
    .string()
    .min(8, "minimus 8 characters password")
    .max(15, "maximus 15 characters in password")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/,
      "password must have min 8 character, 1 uppercase, 1 number and one especial character",
    ),
  locality: LocalitySchema,
  role: z.enum(["admin", "racer"]),
  rank: z.enum(["S", "A", "B", "C", "D"]),
  victories: z.number(),
  defeats: z.number(),
  consecutive_victories: z.number(),
});
