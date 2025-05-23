import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(3, "Username must be at least 3 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  birthDate: z.string().optional(),
  phoneNumber: z.string().regex(/^\+?[0-9]\d{1,14}$/, "Invalid phone number"),
  gender: z.enum(["male", "female", "other"]).optional(),
  religion: z
    .enum(["islam", "hinduism", "christianity", "buddhism", "other"])
    .optional(),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});
