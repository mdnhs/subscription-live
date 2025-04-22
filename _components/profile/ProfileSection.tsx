"use client";
import { User } from "@/_types/usersTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleDollarSign, Copy, Divide, Edit, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ProfileFormContainer from "./ProfileFormContainer";
import ProfileInfoShow from "./ProfileInfoShow";
import ProfilePictureUploader from "./ProfilePictureUploader";
import CreditMarket from "../market/CreditMarket";

interface ProfileSectionProps {
  user: User;
}

const ProfileSection = ({ user }: ProfileSectionProps) => {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreditMarket, setIsCreditMarket] = useState(false);
  const [userData, setUserData] = useState<User>(user);

  const handleImageChange = (file: File, previewUrl: string) => {
    setProfilePic(file);
    setPreviewImageUrl(previewUrl);
  };

  const copyOptions = [
    {
      type: "string" as const,
      label: "Copy username",
      successMessage: "Username copied to clipboard!",
    },
    {
      type: "link" as const,
      label: "Copy profile link",
      successMessage: "Profile link copied to clipboard!",
    },
    {
      type: "referLink" as const,
      label: "Copy refer link",
      successMessage: "Refer link copied to clipboard!",
    },
  ];

  const copyUsername = async (type: "string" | "link" | "referLink") => {
    try {
      let textToCopy = "";
      if (type === "string") {
        textToCopy = userData.username;
      } else if (type === "link") {
        textToCopy = `${window.location.origin}/profile/${userData.username}`;
      } else {
        textToCopy = `${process.env.NEXTAUTH_URL}/register?referId=${userData.username}`;
      }

      await navigator.clipboard.writeText(textToCopy);

      const option = copyOptions.find((opt) => opt.type === type);
      toast.success(option?.successMessage);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy to clipboard");
    }
  };
  console.log(isCreditMarket);
  return (
    <Card className=" shadow-md">
      <CardContent className="px-6 ">
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
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-bold">{userData?.username}</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {copyOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.type}
                      onClick={() => copyUsername(option.type)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                  <X className="mr-2 h-4 w-4" />
                  Cancel Edit
                </Button>
              )}
            </div>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsCreditMarket((oldValue) => !oldValue)}
              className={`flex self-start gap-2 items-center w-[104px] ${
                isCreditMarket ? "bg-red-500 text-white hover:bg-red-400" : ""
              }`}
            >
              {" "}
              {isCreditMarket ? <X /> : <CircleDollarSign />}
              {isCreditMarket ? (
                <div>Close</div>
              ) : (
                <div> Credit: {userData?.refCredit ?? 0}</div>
              )}
            </Button>
          )}
        </div>

        {!isEditing ? (
          isCreditMarket ? (
            <CreditMarket refCredit={userData?.refCredit ?? 0} />
          ) : (
            <ProfileInfoShow
              id={userData?.id?.toString()}
              fullName={userData.fullName || ""}
              username={userData.username || ""}
              email={userData.email || ""}
              phoneNumber={userData.phoneNumber || ""}
              birthDate={userData.birthDate || ""}
              gender={userData.gender || ""}
              religion={userData.religion || ""}
              bio={userData.bio || ""}
            />
          )
        ) : (
          <ProfileFormContainer
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
  );
};

export default ProfileSection;
