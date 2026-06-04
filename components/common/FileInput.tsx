"use client";

import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FileInputProps {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
  className?: string;
  existingAttachments?: any[];
  onRemoveExisting?: (id: number) => void;
}

interface PreviewItem {
  id: string;
  name: string;
  url: string | null;
  isImage: boolean;
  isExisting?: boolean;
}

export function FileInput({
  label,
  error,
  registration,
  className,
  existingAttachments = [],
  onRemoveExisting,
}: FileInputProps) {
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const getFullUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return `${backendUrl.replace(/\/api\/?$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
  };

  useEffect(() => {
    const localItems = previews.filter((p) => !p.isExisting);

    const mappedExisting = existingAttachments.map((file) => {
      const isImg =
        file.attachment_type === "image" ||
        file.file_type?.startsWith("image/") ||
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.file_name);
      return {
        id: `existing-${file.id}`,
        name: file.file_name,
        url: getFullUrl(file.file_url),
        isImage: isImg,
        isExisting: true,
      };
    });

    setPreviews([...mappedExisting, ...localItems]);
  }, [existingAttachments]);

  useEffect(() => {
    return () => {
      previews.forEach((item) => {
        if (item.url && !item.isExisting) URL.revokeObjectURL(item.url);
      });
    };
  }, [previews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    registration.onChange(e);

    const files = e.target.files;
    if (!files || files.length === 0) {
      setPreviews((prev) => prev.filter((p) => p.isExisting));
      return;
    }

    const fileList = Array.from(files);
    const newPreviews = fileList.map((file, idx) => {
      const isImage = file.type.startsWith("image/");
      return {
        id: `local-${file.name}-${idx}`,
        name: file.name,
        url: isImage ? URL.createObjectURL(file) : null,
        isImage,
        isExisting: false,
      };
    });

    setPreviews((prev) => [
      ...prev.filter((p) => p.isExisting),
      ...newPreviews,
    ]);
  };

  const handleRemoveSingle = (item: PreviewItem) => {
    if (item.isExisting && item.id.startsWith("existing-")) {
      const rawId = Number(item.id.replace("existing-", ""));
      onRemoveExisting?.(rawId);
    } else {
      if (item.url) URL.revokeObjectURL(item.url);
      setPreviews((prev) => prev.filter((p) => p.id !== item.id));
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = "";
      }
    }
  };

  const handleClearAll = () => {
    previews.forEach((item) => {
      if (item.isExisting && item.id.startsWith("existing-")) {
        const rawId = Number(item.id.replace("existing-", ""));
        onRemoveExisting?.(rawId);
      } else if (item.url) {
        URL.revokeObjectURL(item.url);
      }
    });

    setPreviews([]);

    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = "";
    }

    const event = { target: { name: registration.name, value: null } };
    registration.onChange(event as any);
  };

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
        {label}
      </Label>

      <div
        className={`relative flex flex-col items-center justify-center min-h-32 rounded-2xl bg-background/50 border border-dashed p-4 ${
          error
            ? "border-destructive/50 ring-1 ring-destructive/50"
            : "border-muted hover:border-primary/40"
        }`}
      >
        <input
          type="file"
          multiple
          {...registration}
          ref={(e) => {
            registration.ref(e);
            hiddenInputRef.current = e;
          }}
          onChange={handleFileChange}
          className="hidden"
        />

        {previews.length === 0 ? (
          <button
            type="button"
            onClick={() => hiddenInputRef.current?.click()}
            className="flex flex-col items-center text-muted-foreground/60 text-xs w-full py-6 h-full justify-center"
          >
            <Upload className="w-5 h-5 mb-1 text-primary" />
            <span>Click or drag files to upload</span>
          </button>
        ) : (
          <div className="w-full space-y-4">
            <div className="flex flex-wrap gap-4 justify-start">
              {previews.map((item) => (
                <div
                  key={item.id}
                  className="relative group flex flex-col items-center text-center w-20"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveSingle(item)}
                    className="absolute -top-1.5 -right-1.5 bg-black/80 hover:bg-destructive text-white p-1 rounded-full z-30 shadow-md transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>

                  {item.isImage && item.url ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-muted shadow-sm">
                      <img
                        src={item.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-muted rounded-xl border border-black/5 flex items-center justify-center w-16 h-16 shadow-sm">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                  )}

                  <span className="truncate w-full text-[9px] text-muted-foreground mt-1 block px-0.5">
                    {item.name}
                  </span>
                  {item.isExisting && (
                    <span className="text-[8px] bg-primary/10 text-primary font-medium rounded px-1 mt-0.5 scale-90">
                      Saved
                    </span>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => hiddenInputRef.current?.click()}
                className="w-16 h-16 flex flex-col items-center justify-center rounded-xl border border-dashed border-muted hover:border-primary/40 bg-background/40 hover:bg-background text-muted-foreground transition-all shadow-sm"
              >
                <Upload className="w-4 h-4 text-primary" />
                <span className="text-[9px] mt-1 font-medium">Add Files</span>
              </button>
            </div>

            <div className="flex justify-end border-t border-black/5 dark:border-white/5 pt-2">
              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-destructive px-2 py-1 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            </div>
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
