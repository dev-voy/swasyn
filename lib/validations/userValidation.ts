import { z } from "zod";

const registeredUserSchema = z.object({
  firstName: z
    .string("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(30),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string("Email is required").email(),
  image: z.string().optional(),
  phone: z.string().optional(),
});

export { registeredUserSchema };
