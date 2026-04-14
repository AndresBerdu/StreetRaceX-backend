import z from "zod";
import { LocalitySchema } from "./LocalitySchema.ts";

export const UserShema = z.object({
  username: z.string().min(2, "minus 2 caracteres in username"),
  email: z.string().email("The password must be a format email"),
  password: z
    .string()
    .min(8, "minimus 8 caracteresin password")
    .max(15, "maximus 15 caracteres in password")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/,
      "password must have min 8 caracteres, 1 uppercase, 1 number and one especial caracter",
    ),
  profile_photo: z.string().url("The profile photo must be format url"),
  locality: LocalitySchema,
});
