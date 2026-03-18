"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookText, Home, Settings, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

const menu = [
  {
    section: "Main menu",
    items: [
      { name: "Home", path: "/dashboard", icon: Home },
      { name: "Settings", path: "/dashboard/settings", icon: Settings },
    ],
  },
  {
    section: "Invoice",
    items: [{ name: "List", path: "/dashboard/invoice-list", icon: Ticket }],
  },
  {
    section: "COA",
    items: [{ name: "List", path: "/dashboard/cashbook", icon: BookText }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-sidebar text-sidebar-foreground border-r border-sidebar-border p-6 flex flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
          ERP
        </div>
        <h1 className="text-xl font-semibold">Placeholder</h1>
      </div>

      <div className="space-y-6">
        {menu.map((group) => (
          <div key={group.section}>
            <p className="text-xs text-muted-foreground mb-2">
              {group.section}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center justify-between px-4 py-2 rounded-xl text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </div>

                    {item.name === "Tickets" && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        2
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
