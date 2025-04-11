// pages/profile.tsx
"use client";

import { User, useUserStore } from "@/_store/UserStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState, ReactNode } from "react";
import { useForm, FieldValues, Path, UseFormReturn } from "react-hook-form";
import * as z from "zod";

// Define validation schemas with zod
const profileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  birthDate: z.string().optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  religion: z
    .enum(["islam", "hinduism", "christianity", "buddhism", "other"])
    .optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

// Type for field definitions to generate form fields dynamically
type FieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder: string;
  type?: string;
  options?: { value: string; label: string }[];
  colSpan?: number;
};

// Dynamic form field component
function DynamicFormField<T extends FieldValues>({
  form,
  field,
}: {
  form: UseFormReturn<T>;
  field: FieldConfig<T>;
}) {
  if (field.options) {
    // Select field
    return (
      <FormField
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem className={field.colSpan === 2 ? "md:col-span-2" : ""}>
            <FormLabel>{field.label}</FormLabel>
            <Select
              onValueChange={formField.onChange}
              defaultValue={formField.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // Input field
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={field.colSpan === 2 ? "md:col-span-2" : ""}>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <Input
              type={field.type || "text"}
              placeholder={field.placeholder}
              {...formField}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Loading indicator component
const LoadingIndicator = () => (
  <div className="container py-5 flex justify-center">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

// Login Required component
const LoginRequired = () => (
  <div className="container py-5">
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-6">
        <div className="text-red-500 text-center py-8">
          Please log in to view your profile
        </div>
      </CardContent>
    </Card>
  </div>
);

// Error display component
const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-md border border-red-200">
    {message}
  </div>
);

// Form section component
function FormSection<T extends FieldValues>({
  title,
  form,
  onSubmit,
  fields,
  submitLabel,
  loading,
  footer,
}: {
  title: string;
  defaultOpen?: boolean;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => Promise<void>;
  fields: FieldConfig<T>[];
  submitLabel: string | ReactNode;
  loading: boolean;
  footer?: ReactNode;
}) {
  return (
    <AccordionItem value={title.toLowerCase().replace(/\s+/g, '-')} className="border-b">
      <AccordionTrigger className="py-4 font-semibold text-lg text-primary">
        {title}
      </AccordionTrigger>
      <AccordionContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field) => (
                <DynamicFormField key={field.name.toString()} form={form} field={field} />
              ))}
            </div>
            <div className="flex justify-between items-center pt-2">
              {footer}
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
            </div>
          </form>
        </Form>
      </AccordionContent>
    </AccordionItem>
  );
}

const ProfilePage = () => {
  const {
    user,
    loading,
    error,
    getCurrentUser,
    updateUser,
    updatePassword,
    uploadProfilePicture,
  } = useUserStore();
  const { data: session, status } = useSession();
  const jwtToken = useMemo(
    () => (session?.user as { jwt?: string })?.jwt || "",
    [session]
  );
  const [profilePic, setProfilePic] = useState<File | null>(null);
  
  // Set default accordion value to have profile section open
  const [accordionValue, setAccordionValue] = useState<string[]>(["profile"]);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      birthDate: "",
      phoneNumber: "",
      gender: undefined,
      religion: undefined,
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (jwtToken && status === "authenticated") {
      getCurrentUser(jwtToken);
    }
  }, [getCurrentUser, jwtToken, status]);

  useEffect(() => {
    if (user) {
      profileForm.reset({
        username: user.username,
        email: user.email,
        bio: user.bio || "",
        birthDate: user.birthDate
          ? new Date(user.birthDate).toISOString().split("T")[0]
          : "",
        phoneNumber: user.phoneNumber || "",
        gender: user.gender,
        religion: user.religion,
      });
    }
  }, [user, profileForm]);

  // Define profile fields configuration
  const profileFields: FieldConfig<ProfileFormValues>[] = [
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
      ]
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
      ]
    },
    { 
      name: "bio", 
      label: "Bio", 
      placeholder: "Tell us about yourself",
      colSpan: 2
    },
  ];

  // Define password fields configuration
  const passwordFields: FieldConfig<PasswordFormValues>[] = [
    { 
      name: "currentPassword", 
      label: "Current Password", 
      placeholder: "Current password",
      type: "password"
    },
    { 
      name: "newPassword", 
      label: "New Password", 
      placeholder: "New password",
      type: "password" 
    },
  ];

  const handleProfileSubmit = async (data: ProfileFormValues) => {
    if (!jwtToken) {
      profileForm.setError("root", { message: "Authentication required" });
      return;
    }

    const updateData: Partial<User> = { ...data };
    if (profilePic) {
      try {
        const imageUrl = await uploadProfilePicture(jwtToken, profilePic);
        updateData.profilePicture = imageUrl;
        setProfilePic(null); // Clear the file input after successful upload
      } catch {
        profileForm.setError("root", {
          message: "Failed to upload profile picture",
        });
        return;
      }
    }

    await updateUser(jwtToken, updateData);
  };

  const handlePasswordSubmit = async (data: PasswordFormValues) => {
    if (!jwtToken) {
      passwordForm.setError("root", { message: "Authentication required" });
      return;
    }
    await updatePassword(jwtToken, data.currentPassword, data.newPassword);
    passwordForm.reset();
  };

  if (status === "loading" || (loading && !user)) {
    return <LoadingIndicator />;
  }

  if (!jwtToken) {
    return <LoginRequired />;
  }

  return (
    <div className="container py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-md">
        <CardContent className="p-6">
          {error && <ErrorDisplay message={error} />}

          <div className="mb-8 flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-primary/10">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary/70 to-primary/30 text-white">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold">{user?.username}</h2>
              <p className="text-muted-foreground mb-3">{user?.email}</p>
              <div className="relative">
                <Input
                  type="file"
                  id="profile-pic"
                  accept="image/*"
                  onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
                  className="opacity-0 absolute inset-0 w-full cursor-pointer"
                />
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Upload className="mr-2 h-4 w-4" />
                  {profilePic ? profilePic.name : "Upload New Photo"}
                </Button>
              </div>
            </div>
          </div>

          <Accordion 
            type="multiple" 
            value={accordionValue} 
            onValueChange={setAccordionValue} 
            className="w-full"
          >
            <FormSection
              title="Profile"
              defaultOpen={true}
              form={profileForm}
              onSubmit={handleProfileSubmit}
              fields={profileFields}
              submitLabel="Update Profile"
              loading={loading}
              footer={
                <p className="text-xs text-muted-foreground">
                  User ID: {user?.id}
                </p>
              }
            />

            <FormSection
              title="Change Password"
              form={passwordForm}
              onSubmit={handlePasswordSubmit}
              fields={passwordFields}
              submitLabel="Change Password"
              loading={loading}
            />
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;