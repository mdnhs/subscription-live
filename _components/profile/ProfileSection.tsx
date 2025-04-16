"use client";
import { User } from "@/_types/usersTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, X } from "lucide-react";
import { useState } from "react";
import ProfileFormContainer from "./ProfileFormContainer";
import ProfileInfoShow from "./ProfileInfoShow";
import ProfilePictureUploader from "./ProfilePictureUploader";

interface ProfileSectionProps {
  user: User;
}

const ProfileSection = ({ user }: ProfileSectionProps) => {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<User>(user);

  const handleImageChange = (file: File, previewUrl: string) => {
    setProfilePic(file);
    setPreviewImageUrl(previewUrl);
  };

  return (
    <div className="container py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-md">
        <CardContent className="p-6">
          <div className="mb-8 flex flex-col sm:flex-row items-center gap-6">
            <ProfilePictureUploader
              currentImageUrl={previewImageUrl || userData?.profilePicture}
              fallbackInitial={userData?.username?.[0]?.toUpperCase() || "U"}
              size="lg"
              onImageChange={handleImageChange}
              disabled={isUpdating}
              isEditing={isEditing}
            />

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
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-400"
                  >
                    <X className="mr-2 h-4 w-4 " />
                    Cancel Edit
                  </Button>
                )}
              </div>
            </div>
          </div>

          {!isEditing ? (
            <ProfileInfoShow
              id={userData.id.toString()}
              username={userData.username || ""}
              email={userData.email || ""}
              phoneNumber={userData.phoneNumber || ""}
              birthDate={userData.birthDate || ""}
              gender={userData.gender || ""}
              religion={userData.religion || ""}
              bio={userData.bio || ""}
            />
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
