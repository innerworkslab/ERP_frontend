"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
  label: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number" | "textarea" | "date";
  error?: string;
  registration: UseFormRegisterReturn;
  className?: string;
  rows?: number;
  step?: string | number;
}

export function FormInput({
  label,
  placeholder,
  type = "text",
  error,
  registration,
  className,
  rows = 3,
  step,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isTextarea = type === "textarea";

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
        {label}
      </Label>

      <div className="relative">
        {isTextarea ? (
          <Textarea
            placeholder={placeholder}
            rows={rows}
            {...registration}
            className={`bg-background/50 border-none rounded-2xl focus-visible:ring-primary/20 resize-none min-h-[100px] transition-all ${
              error ? "ring-1 ring-destructive/50" : ""
            }`}
          />
        ) : (
          <>
            <Input
              type={inputType}
              step={step}
              placeholder={placeholder}
              min={type === "number" ? 0 : undefined}
              onFocus={
                type === "date"
                  ? (e) => (e.currentTarget.type = "date")
                  : undefined
              }
              {...registration}
              className={`bg-background/50 border-none h-[40px] rounded-2xl focus-visible:ring-primary/20 transition-all ${
                isPassword ? "pr-11" : ""
              } ${error ? "ring-1 ring-destructive/50" : ""} ${
                type === "date" ? "block w-full text-left" : ""
              }`}
            />

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground/50 hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
          </>
        )}
      </div>

      {error && (
        <p className="text-[10px] text-destructive font-semibold ml-1">
          {error}
        </p>
      )}
    </div>
  );
}
