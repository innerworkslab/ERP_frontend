"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FormCheckboxProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
  id?: string;
}

export function FormCheckbox({
  label,
  checked,
  onCheckedChange,
  error,
  disabled = false,
  id,
}: FormCheckboxProps) {
  const generatedId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3 space-y-0 rounded-xl border p-4 shadow-sm transition-colors hover:bg-muted/30">
        <Checkbox
          id={generatedId}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className="h-5 w-5 rounded-md border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor={generatedId}
            className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {label}
          </Label>
        </div>
      </div>
      {error && (
        <p className="text-[11px] font-medium text-destructive ml-1">{error}</p>
      )}
    </div>
  );
}
