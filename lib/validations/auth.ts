// File: lib/validations/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z
  .object({
    userName: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(15, { message: "Username cannot exceed 15 characters" })
      .regex(/^[a-zA-Z]+[a-zA-Z0-9]*$/, {
        message:
          "Username must contain only letters or letters with numbers, no special characters or numbers only",
      })
      .regex(/^\S+$/, { message: "Username cannot contain spaces" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
