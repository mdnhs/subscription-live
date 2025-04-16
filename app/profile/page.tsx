// pages/profile.tsx

import { getCurrentUser } from "@/services/api/userRequest";
import { fetchPublic } from "@/services/fetch/ssrFetch";
import { auth } from "../auth";
import ProfileSection from "@/_components/profile/ProfileSection";
import { User } from "@/_types/usersTypes";

export default async function ProfilePage() {
  const session = await auth();
  const jwt = (session?.user as { jwt?: string })?.jwt;

  let currentUser: User = {
    id: 0,
    username: "",
    email: "",
  };
  try {
    const req = getCurrentUser(jwt);
    const res = await fetchPublic(req);
    currentUser = res ?? {};
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className=" container pt-28 pb-8">
      <ProfileSection user={currentUser} />
    </div>
  );
}
