"use client";

import * as React from "react";
import { Plus, Search, ChevronDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface Option {
  id: string | number;
  name: string;
}

interface FormSelectProps {
  label: string;
  placeholder?: string;
  options: Option[];
  value?: string | number;
  onValueChange: (value: string) => void;
  onRefresh?: () => Promise<void> | void;
  renderCreateForm?: (closeModal: () => void) => React.ReactNode;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
  isClearable?: boolean;
}

export function FormSelect({
  label,
  placeholder = "Select an option",
  options,
  value,
  onValueChange,
  onRefresh,
  renderCreateForm,
  error,
  disabled,
  loading,
  isClearable = true,
}: FormSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [hasInitialOptions, setHasInitialOptions] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const previousOptionsRef = React.useRef<Option[]>(options);

  React.useEffect(() => {
    if (options.length > 0 && !hasInitialOptions) {
      previousOptionsRef.current = options;
      setHasInitialOptions(true);
    }
  }, [options, hasInitialOptions]);

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (
      hasInitialOptions &&
      previousOptionsRef.current.length < options.length
    ) {
      const newOption = options.find(
        (opt) => !previousOptionsRef.current.some((prev) => prev.id === opt.id),
      );
      if (newOption) {
        onValueChange(newOption.id.toString());
      }
      previousOptionsRef.current = options;
    }
  }, [options, onValueChange, hasInitialOptions]);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedOption = options.find(
    (opt) => opt.id.toString() === value?.toString(),
  );

  const handleSelect = (id: string) => {
    onValueChange(id);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange("");
    setSearchTerm("");
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsModalOpen(true);
  };

  const handleSuccess = async () => {
    setIsModalOpen(false);
    if (onRefresh) await onRefresh();
  };

  return (
    <div className="flex flex-col gap-1.5 relative w-full" ref={containerRef}>
      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
        {label}
      </Label>

      <div
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        className={cn(
          "min-h-[40px] w-full cursor-pointer rounded-xl border bg-background/60 px-3 py-2 transition-all flex items-center justify-between gap-2",
          isOpen
            ? "border-primary ring-2 ring-primary/10"
            : "border-black/5 dark:border-white/5",
          disabled || loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-black/20 dark:hover:border-white/20",
          error && "border-destructive",
        )}
      >
        <span
          className={cn(
            "text-sm truncate",
            !selectedOption && "text-muted-foreground",
          )}
        >
          {loading
            ? "Loading..."
            : selectedOption
              ? selectedOption.name
              : placeholder}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          {isClearable && selectedOption && !disabled && !loading && (
            <X
              onClick={handleClear}
              className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive transition-colors mr-1"
            />
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 opacity-50 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full z-50 bg-card border border-muted-foreground/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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

          <div className="max-h-60 overflow-y-auto p-1.5">
            {renderCreateForm && (
              <div
                onClick={handleOpenModal}
                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium text-primary hover:bg-primary/10 transition-colors mb-1"
              >
                <Plus className="h-4 w-4" />
                Add New {label}
              </div>
            )}

            {renderCreateForm && <div className="h-px bg-border my-1 mx-1" />}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = value?.toString() === opt.id.toString();
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelect(opt.id.toString())}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors mb-0.5",
                      isSelected
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted",
                    )}
                  >
                    <span>{opt.name}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                No results found
              </div>
            )}
          </div>
        </div>
      )}

      {renderCreateForm && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New {label}</DialogTitle>
            </DialogHeader>
            <div className="py-4">{renderCreateForm(handleSuccess)}</div>
          </DialogContent>
        </Dialog>
      )}

      {error && (
        <p className="text-[10px] text-destructive font-semibold ml-1 uppercase italic">
          {error}
        </p>
      )}
    </div>
  );
}
