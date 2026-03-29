"use client";

import React, { useState } from "react";
import { LogOut, KeyRound, User as UserIcon, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { routeConfig } from "@/configs/route.config";
import { deleteCookie, getDecryptedCookie } from "@/lib/cookie.utils";
import { COOKIES } from "@/constants/cookie.constant";

export default function NavHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [user] = useState<{ name: string; email: string } | null>(() => {
    if (typeof window !== "undefined") {
      return getDecryptedCookie(COOKIES.AUTH_USER);
    }
    return null;
  });

  const getActiveRoute = (path: string) => {
    if (routeConfig[path]) return routeConfig[path];

    const routes = Object.keys(routeConfig);
    for (const route of routes) {
      const regexPath = route.replace(/:[^\/]+/g, "[^/]+");
      const matcher = new RegExp(`^${regexPath}$`);

      if (matcher.test(path)) {
        return routeConfig[route];
      }
    }

    return {
      title: "Dashboard",
      desc: "Welcome back to your control panel.",
      breadcrumb: "Home",
    };
  };

  const currentRoute = getActiveRoute(pathname);

  const handleLogout = () => {
    deleteCookie(COOKIES.AUTH_USER);
    router.push("/");
  };

  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-50 px-8 py-6 flex items-center justify-between dark:bg-card/10 backdrop-blur-xl border-b border-white/5">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          {currentRoute.title}
        </h2>

        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          {currentRoute.desc}
        </p>

        <nav className="flex mt-3" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
            {pathSegments
              .map((segment, index) => {
                const isNumber = !isNaN(Number(segment));
                const isNextEdit =
                  pathSegments[index + 1]?.toLowerCase() === "edit";

                if (isNumber && isNextEdit) return null;

                let displayLabel = segment;
                if (isNumber) displayLabel = "Detail";

                return {
                  displayLabel,
                  href: `/${pathSegments.slice(0, index + 1).join("/")}`,
                };
              })
              .filter(
                (item): item is { displayLabel: string; href: string } =>
                  item !== null,
              )
              .map((item, index, filteredArray) => {
                const isLast = index === filteredArray.length - 1;

                return (
                  <React.Fragment key={item.href}>
                    {index > 0 && <li>/</li>}

                    <li>
                      {isLast ? (
                        <span className="text-primary truncate max-w-[150px] block font-bold">
                          {item.displayLabel}
                        </span>
                      ) : (
                        <Link
                          href={item.href}
                          className="hover:text-foreground transition-colors cursor-pointer"
                        >
                          {item.displayLabel}
                        </Link>
                      )}
                    </li>
                  </React.Fragment>
                );
              })}
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-gray/30 dark:border-white/10 backdrop-blur-md">
          <ThemeToggle />

          <div className="h-4 w-[1px] bg-gray-600/40 dark:bg-white/10 mx-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-auto flex items-center gap-2 pl-1 pr-2 rounded-xl hover:bg-white/10 transition-all border-none focus-visible:ring-0"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-500/20 flex items-center justify-center border border-white/10 text-muted-foreground font-bold text-[10px] uppercase">
                  {user?.name?.charAt(0) || <UserIcon className="w-4 h-4" />}
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-56 bg-card/80 backdrop-blur-2xl border-white/5 shadow-2xl rounded-2xl p-2"
            >
              <DropdownMenuLabel className="px-3 py-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">
                    {user?.name || "User"}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate font-medium">
                    {user?.email || "No email found"}
                  </span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-white/5 mx-1" />

              <DropdownMenuItem className="rounded-xl px-3 py-2 gap-3 cursor-pointer focus:bg-white/10 transition-colors">
                <KeyRound className="w-4 h-4 opacity-70" />
                <span className="text-sm">Change Password</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="rounded-xl px-3 py-2 gap-3 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
