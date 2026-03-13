import z from "zod";

export const CarSchema = z.object({
  type_vehicle: z
    .string("el tipo de vehiculo debe de ser un string")
    .min(2, "minimo 2 caracteres")
    .max(15, "maximo 15 caracteres"),
  brand: z
    .string("la marca del vehiculo debe de ser un string")
    .min(2, "minimo 2 caracteres")
    .max(15, "maximo 15 caracteres"),
  model: z.string().min(2).max(30),
  created_year: z.string(),
  color: z.string().min(2).max(30),
  plate: z
    .string()
    .regex(
      /^[A-Za-z]{3}-\d{3}$/,
      "la placa debe de seguir el siguiente formato: 3 letras - 3 números",
    ),
  photo: z
    .string()
    .regex(
      /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}([\/\w\.-]*)*\/?$/,
      "La foto debe de seguir un formato de url valido",
    ),
  modifications: z.string().min(2).max(200),
});

export type Car = z.infer<typeof CarSchema>;
