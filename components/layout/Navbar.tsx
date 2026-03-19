"use client";

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
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const routeConfig: Record<
  string,
  { title: string; desc: string; breadcrumb: string }
> = {
  "/auth/branches": {
    title: "Branch Management",
    desc: "Manage your regional offices and branch locations.",
    breadcrumb: "Branches",
  },
  "/auth/branches/add": {
    title: "Add Branch",
    desc: "Create a new branch for your organization.",
    breadcrumb: "Add",
  },
  "/auth/departments": {
    title: "Department Management",
    desc: "Manage your organizational departments.",
    breadcrumb: "Departments",
  },
  "/auth/departments/add": {
    title: "Add Department",
    desc: "Create a new department for your organization.",
    breadcrumb: "Add",
  },
};

export default function NavHeader() {
  const pathname = usePathname();

  const currentRoute = routeConfig[pathname] || {
    title: "Dashboard",
    desc: "Welcome back to your control panel.",
    breadcrumb: "Home",
  };

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
            <li>Auth</li>
            <li>/</li>
            <li className="text-primary">{currentRoute.breadcrumb}</li>
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
                <div className="w-7 h-7 rounded-lg bg-slate-500/20 flex items-center justify-center border border-white/10">
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
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
                  <span className="text-sm font-semibold">Super Admin</span>
                  <span className="text-[10px] text-muted-foreground truncate">
                    superadmin@example.com
                  </span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-white/5 mx-1" />

              <DropdownMenuItem className="rounded-xl px-3 py-2 gap-3 cursor-pointer focus:bg-white/10">
                <KeyRound className="w-4 h-4 opacity-70" />
                <span className="text-sm">Change Password</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="rounded-xl px-3 py-2 gap-3 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={() => console.log("Logging out...")}
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
