"use client";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import React from "react";

export function SiteHeader() {
  const pathname = usePathname();

  // Parse path segments and create breadcrumb items
  const generateBreadcrumbs = () => {
    // Skip empty segments and handle root path
    const segments = pathname.split("/").filter((segment) => segment);

    if (segments.length === 0) {
      return [{ label: "Home", path: "/", isCurrentPage: true }];
    }

    // Build breadcrumb items with accumulated paths
    return [
      { label: "Home", path: "/", isCurrentPage: false },
      ...segments.map((segment, index) => {
        // Create accumulated path for this breadcrumb
        const path = `/${segments.slice(0, index + 1).join("/")}`;
        // Format segment label to be more readable (capitalize, replace hyphens, etc.)
        const label = segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

        return {
          label,
          path,
          isCurrentPage: index === segments.length - 1,
        };
      }),
    ];
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {crumb.isCurrentPage ? (
                    <BreadcrumbPage className="font-semibold">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.path}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
