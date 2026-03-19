"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookText, Home, Split, Ticket, Building } from "lucide-react";
import { cn } from "@/lib/utils";

const menu = [
  {
    section: "Overview",
    items: [{ name: "Dashboard", path: "/auth", icon: Home }],
  },
  {
    section: "Management",
    items: [
      { name: "Branches", path: "/auth/branches", icon: Split },
      { name: "Departments", path: "/auth/departments", icon: Building },
      { name: "Invoice List", path: "/auth/invoice-list", icon: Ticket },
    ],
  },
  {
    section: "Accounting",
    items: [{ name: "Cashbook (COA)", path: "/auth/cashbook", icon: BookText }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen sticky top-0 bg-card/20 backdrop-blur-2xl border-r border-white/5 p-6 flex flex-col transition-all">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-red-500 shadow-lg shadow-purple-500/20 flex items-center justify-center font-bold text-white tracking-tighter">
          ERP
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold leading-none tracking-tight">
            InnerWorks
          </h1>
        </div>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
        {menu.map((group) => (
          <div key={group.section} className="space-y-3">
            <p className="px-4 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">
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
                      "group flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300",
                      active
                        ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(168,85,247,0.05)]"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "w-4 h-4 transition-transform duration-300 group-hover:scale-110",
                          active ? "text-primary" : "text-muted-foreground/70",
                        )}
                      />
                      {item.name}
                    </div>
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
