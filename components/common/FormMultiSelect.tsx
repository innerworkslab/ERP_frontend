"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface Option {
  id: string;
  name: string;
}

interface FormMultiSelectProps {
  label?: string;
  options: Option[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
}

export function FormMultiSelect({
  label,
  options,
  value,
  onValueChange,
  placeholder = "Select branches...",
  error,
}: FormMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleOption = (id: string) => {
    const newValue = value.includes(id)
      ? value.filter((v) => v !== id)
      : [...value, id];
    onValueChange(newValue);
  };

  const removeOption = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onValueChange(value.filter((v) => v !== id));
  };

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      {label && (
        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60 ml-1">
          {label}
        </Label>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "min-h-[42px] w-full cursor-pointer rounded-xl border bg-background px-3 py-2 transition-all flex items-center justify-between gap-2",
          isOpen
            ? "border-primary ring-2 ring-primary/10"
            : "border-muted-foreground/20",
          error && "border-destructive",
        )}
      >
        <div className="flex flex-wrap gap-1.5 flex-1">
          {value.length > 0 ? (
            value.map((id) => {
              const option = options.find((o) => o.id === id);
              return (
                <Badge
                  key={id}
                  variant="secondary"
                  className="rounded-md bg-secondary/50 hover:bg-secondary flex items-center gap-1 py-0.5 px-2 border-none"
                >
                  <span className="text-xs">{option?.name}</span>
                  <X
                    className="h-3 w-3 cursor-pointer opacity-60 hover:opacity-100"
                    onClick={(e) => removeOption(e, id)}
                  />
                </Badge>
              );
            })
          ) : (
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-50 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full z-50 bg-background border border-muted-foreground/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center border-b px-3 bg-muted/20">
            <Search className="h-4 w-4 opacity-40 shrink-0" />
            <input
              autoFocus
              placeholder="Search..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm h-10 px-2 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="max-h-60 overflow-y-auto p-1.5 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(option.id);
                    }}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors mb-0.5",
                      isSelected
                        ? "bg-primary/5 text-primary font-medium"
                        : "hover:bg-muted",
                    )}
                  >
                    <span>{option.name}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground italic">
                No results found.
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <span className="text-[10px] font-bold text-destructive uppercase italic ml-1">
          {error}
        </span>
      )}
    </div>
  );
}
