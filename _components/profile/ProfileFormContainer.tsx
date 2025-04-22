"use client";
import { User } from "@/_types/usersTypes";
import { Accordion } from "@/components/ui/accordion";
import {
  passwordFields,
  PasswordFormValues,
  profileFields,
  ProfileFormValues,
} from "@/lib/profileFields";
import {
  passwordSchema,
  profileSchema,
} from "@/lib/validations/profileValidation";
import {
  updatePassword,
  updateUser,
  uploadProfilePicture,
} from "@/services/api/userRequest";
import useFetch from "@/services/fetch/csrFecth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useMemo, useState, useEffect } from "react"; // Add useEffect
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ProfileFormSection from "./ProfileFormSection";

interface ProfileSectionProps {
  isUpdating: boolean;
  userData: User;
  profilePic: File | null;
  setIsUpdating: (value: boolean) => void;
  setUserData: (user: User) => void;
  setIsEditing: (value: boolean) => void;
  setProfilePic: (file: File | null) => void;
}

const ProfileFormContainer = ({
  isUpdating,
  userData,
  profilePic,
  setIsUpdating,
  setUserData,
  setIsEditing,
  setProfilePic,
}: ProfileSectionProps) => {
  const { fetchPublic } = useFetch();
  const { data: session, update: updateSession } = useSession();
  const jwtToken = useMemo(
    () => (session?.user as { jwt?: string })?.jwt || "",
    [session]
  );

  const [accordionValue, setAccordionValue] = useState<string[]>(["profile"]);
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: userData.fullName || "",
      username: userData.username || "",
      email: userData.email || "",
      bio: userData.bio || "",
      birthDate: userData.birthDate
        ? new Date(userData.birthDate).toLocaleDateString().split("T")[0]
        : "",
      phoneNumber: userData.phoneNumber || "",
      gender: userData.gender,
      religion: userData.religion,
    },
  });

  // Reset form when userData changes
  useEffect(() => {
    profileForm.reset({
      fullName: userData.fullName || "",
      username: userData.username || "",
      email: userData.email || "",
      bio: userData.bio || "",
      birthDate: userData.birthDate
        ? new Date(userData.birthDate).toLocaleDateString().split("T")[0]
        : "",
      phoneNumber: userData.phoneNumber || "",
      gender: userData.gender,
      religion: userData.religion,
    });
  }, [userData, profileForm]);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const handleProfileSubmit = async (data: ProfileFormValues) => {
    if (!jwtToken) {
      profileForm.setError("root", { message: "Authentication required" });
      return;
    }

    setIsUpdating(true);
    const updateData: Partial<User> = { ...data };

    try {
      // Handle profile picture upload if exists
      if (profilePic) {
        const formData = new FormData();
        formData.append("files", profilePic);
        const uploadReq = uploadProfilePicture(jwtToken, formData);
        const uploadResponse = await fetchPublic(uploadReq);
        if (!uploadResponse.success) throw new Error("Upload failed");
        updateData.profilePicture = uploadResponse.data[0].url;
        setProfilePic(null);
      }

      // Update user data
      const updateReq = updateUser(jwtToken, userData?.id, updateData);
      const updateResponse = await fetchPublic(updateReq);
      if (!updateResponse.success) throw new Error("Update failed");

      // Update local state with complete user object
      const updatedUser = {
        ...userData,
        ...updateResponse.data,
        profilePicture: updateData.profilePicture || userData.profilePicture,
      };
      setUserData(updatedUser);

      // Update session
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          id: userData?.id.toString(),
          name: updatedUser.username,
          email: updatedUser.email,
          image: updatedUser.profilePicture,
          jwt: jwtToken,
        },
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordSubmit = async (data: PasswordFormValues) => {
    if (!jwtToken) {
      passwordForm.setError("root", { message: "Authentication required" });
      return;
    }

    setIsUpdating(true);
    const payload = {
      currentPassword: data.currentPassword,
      password: data.newPassword,
      passwordConfirmation: data.newPassword,
    };

    try {
      const req = updatePassword(jwtToken, payload);
      const response = await fetchPublic(req);
      if (!response.success)
        throw new Error(response.message || "Update failed");

      toast.success("Password updated successfully!");
      passwordForm.reset();
    } catch (error) {
      toast.error("Failed to update password");
      console.error("Password update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Accordion
      type="multiple"
      value={accordionValue}
      onValueChange={setAccordionValue}
      className="w-full"
    >
      <ProfileFormSection
        title="Profile"
        defaultOpen={true}
        form={profileForm}
        onSubmit={handleProfileSubmit}
        fields={profileFields}
        submitLabel="Save Changes"
        loading={isUpdating}
        footer={
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              User ID: {userData?.id}
            </p>
          </div>
        }
      />

      <ProfileFormSection
        title="Change Password"
        form={passwordForm}
        onSubmit={handlePasswordSubmit}
        fields={passwordFields}
        submitLabel="Change Password"
        loading={isUpdating}
      />
    </Accordion>
  );
};

export default ProfileFormContainer;