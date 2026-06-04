"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FileText, X, ChevronLeft, ChevronRight, Download } from "lucide-react";

interface Attachment {
  id: string | number;
  file_name: string;
  file_url: string;
  attachment_type?: string;
  file_type?: string;
}

interface CustomGalleryProps {
  attachments: Attachment[];
}

export default function CustomGallery({ attachments }: CustomGalleryProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (activeIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeIdx]);

  const getFullUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const cleanBackendUrl = backendUrl.replace(/\/api\/?$/, "");
    const cleanRelativeUrl = url.startsWith("/") ? url : `/${url}`;

    return `${cleanBackendUrl}${cleanRelativeUrl}`;
  };

  const images = attachments.filter((file) => {
    if (
      file.attachment_type === "image" ||
      file.file_type?.startsWith("image/")
    ) {
      return true;
    }
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.file_name);
  });

  const openGallery = (targetFileUrl: string) => {
    const idx = images.findIndex((img) => img.file_url === targetFileUrl);
    if (idx !== -1) setActiveIdx(idx);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) =>
      prev !== null && prev > 0 ? prev - 1 : images.length - 1,
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) =>
      prev !== null && prev < images.length - 1 ? prev + 1 : 0,
    );
  };

  return (
    <>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {attachments.map((file) => {
            const isImg =
              file.attachment_type === "image" ||
              file.file_type?.startsWith("image/") ||
              /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.file_name);
            const absoluteUrl = getFullUrl(file.file_url);

            return isImg ? (
              <button
                key={file.id}
                type="button"
                onClick={() => openGallery(file.file_url)}
                className="group relative flex flex-col gap-2 p-2 rounded-xl border border-black/10 dark:border-white/5 bg-background/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-left text-xs font-medium overflow-hidden aspect-video w-full shadow-sm"
              >
                <img
                  src={absoluteUrl}
                  alt={file.file_name}
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5 pt-8 z-10">
                  <p className="truncate text-white text-[11px] font-sans font-medium">
                    {file.file_name}
                  </p>
                </div>
              </button>
            ) : (
              <a
                key={file.id}
                href={absoluteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl border border-black/10 dark:border-white/5 bg-background/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-medium h-full shadow-sm"
              >
                <FileText className="h-4 w-4 text-blue-500 dark:text-blue-400 shrink-0" />
                <span className="truncate text-foreground">
                  {file.file_name}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {mounted &&
        activeIdx !== null &&
        images[activeIdx] &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl flex flex-col justify-between animate-in fade-in duration-200"
            style={{ zIndex: 999999, width: "100vw", height: "100vh" }}
            onClick={() => setActiveIdx(null)}
          >
            <div className="w-full bg-gradient-to-b from-black/90 to-transparent p-6 flex items-center justify-between z-[1000000] shrink-0">
              <span className="text-sm font-sans font-medium text-white/95 drop-shadow-md">
                {activeIdx + 1} / {images.length} —{" "}
                {images[activeIdx].file_name}
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={getFullUrl(images[activeIdx].file_url)}
                  download={images[activeIdx].file_name}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 backdrop-blur-md shadow-lg"
                >
                  <Download className="w-5 h-5" />
                </a>
                <button
                  type="button"
                  onClick={() => setActiveIdx(null)}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 backdrop-blur-md shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 w-full flex items-center justify-center p-4 md:p-12 select-none overflow-hidden">
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-6 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 backdrop-blur-md z-[1000000] shadow-2xl group"
                >
                  <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                </button>
              )}

              <div className="w-full h-full flex items-center justify-center select-none">
                <img
                  src={getFullUrl(images[activeIdx].file_url)}
                  alt={images[activeIdx].file_name}
                  className="max-w-full max-h-full w-auto h-auto object-contain rounded-sm shadow-2xl animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-6 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 backdrop-blur-md z-[1000000] shadow-2xl group"
                >
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>

            <div className="h-6 w-full bg-gradient-to-t from-black/40 to-transparent pointer-events-none shrink-0" />
          </div>,
          document.body,
        )}
    </>
  );
}
