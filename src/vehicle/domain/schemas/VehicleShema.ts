import z from "zod";

export const VehicleSchema = z.object({
  vehicle_type: z.enum(["car", "motorcycle", "skate_board"]),
  brand: z.string().min(2).max(20),
  model: z.string().min(2).max(50),
  year: z
    .number()
    .int()
    .refine((value) => value >= 1000 && value <= 9999, {
      message: "the year of model cannot over higth to 4 digits",
    }),
  color: z
    .string()
    .regex(/#[a-f0-9]{6}/gi, "The color must be in format color HTML"),
  plate: z
    .string()
    .regex(
      /^$|^[A-Z]{3}-\d{3}$/,
      "The plate must be in the next format: ABC-123",
    )
    .nullable(),
  photo: z.string(),
  modifications: z.string().min(2).max(500),
});
