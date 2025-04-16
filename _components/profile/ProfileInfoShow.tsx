import {
  formatDate,
  formatOption,
  formatValue,
} from "@/function/profileDateFormatter";
import React from "react";

interface ProfileInfoProps {
  username: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  religion: string;
  bio?: string;
  id: string;
}

const ProfileInfoShow: React.FC<ProfileInfoProps> = ({
  username,
  email,
  phoneNumber,
  birthDate,
  gender,
  religion,
  bio,
  id,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Username</p>
          <p className="font-medium">{username ?? ""}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p className="font-medium">{email ?? ""}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Phone Number
          </p>
          <p className="font-medium">{formatValue(phoneNumber) ?? ""}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Birth Date
          </p>
          <p className="font-medium">{formatDate(birthDate) ?? ""}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Gender</p>
          <p className="font-medium">{formatOption(gender) ?? ""}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Religion</p>
          <p className="font-medium">{formatOption(religion) ?? ""}</p>
        </div>
        <div className="space-y-1 md:col-span-2">
          <p className="text-sm font-medium text-muted-foreground">Bio</p>
          <p className="font-medium">{bio || "No bio provided"}</p>
        </div>
      </div>
      <div className="pt-2">
        <p className="text-xs text-muted-foreground">User ID: {id ?? ""}</p>
      </div>
    </div>
  );
};

export default ProfileInfoShow;
