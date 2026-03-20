"use client";

import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BaseFilterProps {
  onSearch?: (value: string) => void;
  searchValue?: string;
  placeholder?: string;
  children?: React.ReactNode;
  onAddClick?: () => void;
  addLabel?: string;
  className?: string;
}

export function BaseFilter({
  onSearch,
  searchValue,
  placeholder = "Search...",
  children,
  onAddClick,
  addLabel = "Add New",
  className,
}: BaseFilterProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center justify-between gap-4",
        className,
      )}
    >
      <div className="flex flex-1 items-start gap-4 w-full">
        <div className="relative w-full max-w-sm mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <Input
            placeholder={placeholder}
            value={searchValue ?? ""}
            onChange={(e) => onSearch?.(e.target.value)}
            className="pl-10 bg-background/50 border-none h-11 rounded-2xl focus-visible:ring-primary/30 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">{children}</div>
      </div>

      {onAddClick && (
        <Button
          onClick={onAddClick}
          className="w-full md:w-auto h-11 px-6 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20 gap-2 font-bold transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      )}
    </div>
  );
}
