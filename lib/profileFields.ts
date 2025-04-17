import { FieldConfig } from "@/_types/usersTypes";
import { z } from "zod";
import { passwordSchema, profileSchema } from "./validations/profileValidation";

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;

export const profileFields: FieldConfig<ProfileFormValues>[] = [
  { name: "fullName", label: "Full Name", placeholder: "Your Full Name" },
  { name: "username", label: "Username", placeholder: "Your username" },
  { name: "email", label: "Email", placeholder: "Your email" },
  { name: "phoneNumber", label: "Phone Number", placeholder: "+1234567890" },
  { name: "birthDate", label: "Birth Date", placeholder: "", type: "date" },
  {
    name: "gender",
    label: "Gender",
    placeholder: "Select gender",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
  },
  {
    name: "religion",
    label: "Religion",
    placeholder: "Select Religion",
    options: [
      { value: "islam", label: "Islam" },
      { value: "hinduism", label: "Hinduism" },
      { value: "christianity", label: "Christianity" },
      { value: "buddhism", label: "Buddhism" },
      { value: "other", label: "Other" },
    ],
  },
  {
    name: "bio",
    label: "Bio",
    placeholder: "Tell us about yourself",
    colSpan: 2,
  },
];

export const passwordFields: FieldConfig<PasswordFormValues>[] = [
  {
    name: "currentPassword",
    label: "Current Password",
    placeholder: "Current password",
    type: "password",
  },
  {
    name: "newPassword",
    label: "New Password",
    placeholder: "New password",
    type: "password",
  },
];
