"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface Option {
  id: string | number;
  name: string;
}

interface FormSelectProps {
  label: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onValueChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function FormSelect({
  label,
  placeholder = "Select an option",
  options,
  value,
  onValueChange,
  error,
  disabled,
  loading,
}: FormSelectProps) {
  return (
    <div className="space-y-1.5 w-full">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
        {label}
      </Label>
      <Select
        onValueChange={onValueChange}
        value={value}
        disabled={disabled || loading}
      >
        <SelectTrigger className="w-full min-h-10 bg-background/60 dark:bg-background/40 border border-black/5 dark:border-white/5 px-3 rounded-xl focus:ring-primary/30 outline-none transition-all">
          <SelectValue placeholder={loading ? "Loading..." : placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-card/95 backdrop-blur-3xl border-white/10 rounded-xl">
          {options.length > 0 ? (
            options.map((opt) => (
              <SelectItem
                key={opt.id}
                value={opt.id.toString()}
                className="text-sm cursor-pointer"
              >
                {opt.name}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest">
              No options available
            </div>
          )}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-[10px] text-destructive font-semibold ml-1">
          {error}
        </p>
      )}
    </div>
  );
}
