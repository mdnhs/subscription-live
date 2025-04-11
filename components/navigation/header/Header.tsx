import { getServerToken } from "@/app/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getCurrentUser } from "@/services/api/userRequest";
import { fetchPublic } from "@/services/fetch/ssrfetchPublic";
import { Menu } from "lucide-react";
import HeaderLogo from "./HeaderLogo";
import ProfileDropdown from "./ProfileDropdown";

export default async function Header() {
  let currentUser;
  const token = await getServerToken();

  try {
    const req = await getCurrentUser(token);
    const res = await fetchPublic(req);

    // Extract and filter the data
    currentUser = res;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-20 transition-all duration-300">
      <div className="container h-full">
        <nav className="flex items-center justify-between h-full">
          <HeaderLogo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser && <ProfileDropdown currentUser={currentUser} />}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
              <nav className="mt-4 flex flex-col gap-4">
                {currentUser && <ProfileDropdown currentUser={currentUser} />}
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
