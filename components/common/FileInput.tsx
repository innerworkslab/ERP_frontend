"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FileInputProps {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
  className?: string;
}

export function FileInput({
  label,
  error,
  registration,
  className,
}: FileInputProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
        {label}
      </Label>

      <div
        className={`relative flex items-center justify-center h-28 rounded-2xl bg-background/50 transition-all border border-dashed ${
          error
            ? "border-destructive/50 ring-1 ring-destructive/50"
            : "border-muted hover:border-primary/40"
        }`}
      >
        <input
          type="file"
          {...registration}
          onChange={(e) => {
            registration.onChange(e);
            const file = e.target.files?.[0];
            setFileName(file?.name || null);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        {!fileName ? (
          <div className="flex flex-col items-center text-muted-foreground/60 text-xs">
            <Upload className="w-5 h-5 mb-1" />
            <span>Click or drag file</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs px-3">
            <span className="truncate max-w-37.5">{fileName}</span>
            <button
              type="button"
              onClick={() => {
                setFileName(null);
              }}
              className="p-1 rounded-full hover:bg-muted transition"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
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
