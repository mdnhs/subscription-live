"use client";
import { User } from "@/_types/usersTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  formatDate,
  formatOption,
  formatValue,
} from "@/function/profileDateFormatter";
import { Edit, Upload } from "lucide-react";
import { useState } from "react";
import ProfileFormContainer from "./ProfileFormContainer";

interface ProfileSectionProps {
  user: User;
}

const ProfileSection = ({ user }: ProfileSectionProps) => {
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<User>(user);

  return (
    <div className="container py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-md">
        <CardContent className="p-6">
          <div className="mb-8 flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-primary/10">
              <AvatarImage src={userData?.profilePicture} />
              <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary/70 to-primary/30 text-white">
                {userData?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold">{userData?.username}</h2>
              <p className="text-muted-foreground mb-3">{userData?.email}</p>
              <div className="flex gap-2 justify-center sm:justify-start">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="relative">
                    <Input
                      type="file"
                      id="profile-pic"
                      accept="image/*"
                      onChange={(e) =>
                        setProfilePic(e.target.files?.[0] || null)
                      }
                      className="opacity-0 absolute inset-0 w-full cursor-pointer"
                      disabled={isUpdating}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      disabled={isUpdating}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {profilePic ? profilePic.name : "Upload New Photo"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Username
                  </p>
                  <p className="font-medium">{userData?.username}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="font-medium">{userData?.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </p>
                  <p className="font-medium">
                    {formatValue(userData?.phoneNumber)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Birth Date
                  </p>
                  <p className="font-medium">
                    {formatDate(userData?.birthDate)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Gender
                  </p>
                  <p className="font-medium">
                    {formatOption(userData?.gender)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Religion
                  </p>
                  <p className="font-medium">
                    {formatOption(userData?.religion)}
                  </p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Bio
                  </p>
                  <p className="font-medium">
                    {userData?.bio || "No bio provided"}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  User ID: {userData?.id}
                </p>
              </div>
            </div>
          ) : (
            <ProfileFormContainer
              user={user}
              isUpdating={isUpdating}
              userData={userData}
              profilePic={profilePic}
              setIsUpdating={setIsUpdating}
              setUserData={setUserData}
              setIsEditing={setIsEditing}
              setProfilePic={setProfilePic}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;
