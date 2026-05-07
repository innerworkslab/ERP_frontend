"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { menu } from "@/configs/route.config";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 bg-card/20 backdrop-blur-2xl border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out z-50",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      <div className="p-6 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="relative shrink-0 w-10 h-10 group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <div
              className={cn(
                "absolute inset-0 rounded-2xl bg-linear-to-tr from-purple-500 to-red-500 shadow-lg shadow-purple-500/20 flex items-center justify-center font-bold text-white tracking-tighter transition-all duration-300",
                isHovered ? "opacity-0 scale-75" : "opacity-100 scale-100",
              )}
            >
              ERP
            </div>
            <div
              className={cn(
                "absolute inset-0 rounded-2xl bg-white/10 flex items-center justify-center text-white transition-all duration-300",
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75",
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </div>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300 overflow-hidden">
              <h1 className="text-lg font-bold leading-none tracking-tight whitespace-nowrap">
                InnerWorks
              </h1>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-6 scroll-smooth">
        <div className="space-y-8">
          {menu.map((group) => (
            <div key={group.section} className="space-y-3">
              <div className="h-4 flex items-center px-2">
                {!isCollapsed ? (
                  <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] whitespace-nowrap">
                    {group.section}
                  </p>
                ) : (
                  <div className="h-px w-full bg-white/5" />
                )}
              </div>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={cn(
                        "group flex items-center rounded-2xl text-sm font-medium transition-all duration-300",
                        active
                          ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(168,85,247,0.05)]"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                        isCollapsed ? "justify-center px-0 py-3" : "px-4 py-3",
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110",
                          active ? "text-primary" : "text-muted-foreground/70",
                          !isCollapsed && "mr-3",
                        )}
                      />
                      {!isCollapsed && (
                        <span className="animate-in fade-in slide-in-from-left-2 duration-300 whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
