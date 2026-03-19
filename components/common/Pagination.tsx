"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function Pagination({
  currentPage,
  lastPage,
  onPageChange,
  loading,
}: PaginationProps) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <p className="text-xs text-muted-foreground font-medium">
        Page <span className="text-foreground">{currentPage}</span> of{" "}
        {lastPage}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl bg-card/20 border-white/5 backdrop-blur-md hover:bg-white/10"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl bg-card/20 border-white/5 backdrop-blur-md hover:bg-white/10"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage || loading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
