import { FallbackImage } from "@/_components/container/FallbackImage";
import { siteConfig } from "@/app/site";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";

const Header = () => {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/15 backdrop-blur xl h-20 transition-all duration-300">
      <div className="container h-full">
        <nav className="flex items-center justify-between h-full">
          <Link href="/" className="text-lg font-bold">
            <FallbackImage
              src={siteConfig.websiteLogo}
              width={50}
              height={50}
              quality={100}
              className="rounded-2xl"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <ProfileDropdown />
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
                <ProfileDropdown />
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
      {/* <ProgressBar /> */}
    </header>
  );
};

export default Header;
