import { z } from "zod";
export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Za-z ]+$/, "Name must contain only letters and spaces"),
  email: z.string().trim().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  phone: z
    .union([
      z.string().regex(/^\+?[0-9]{10,15}$/, "Phone must be valid"),
      z.literal(""),
    ])
    .optional(),
});
