"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
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
  value?: string;
  onValueChange: (value: string) => void;
  onRefresh?: () => Promise<void> | void;
  renderCreateForm?: (closeModal: () => void) => React.ReactNode;
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
  onRefresh,
  renderCreateForm,
  error,
  disabled,
  loading,
}: FormSelectProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const previousOptionsRef = React.useRef<Option[]>(options);

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === "__add_new__") {
      setIsModalOpen(false);
      setTimeout(() => setIsModalOpen(true), 10);
      return;
    }
    onValueChange(selectedValue);
  };

  const handleSuccess = async () => {
    previousOptionsRef.current = options;
    setIsModalOpen(false);
    if (onRefresh) {
      await onRefresh();
    }
  };

  React.useEffect(() => {
    if (previousOptionsRef.current.length < options.length) {
      const newOption = options.find(
        (opt) => !previousOptionsRef.current.some((prev) => prev.id === opt.id),
      );
      if (newOption) {
        onValueChange(newOption.id.toString());
      }
      previousOptionsRef.current = options;
    }
  }, [options, onValueChange]);

  const safeValue = value === "__add_new__" || !value ? "" : value.toString();

  return (
    <div className="space-y-1.5 w-full">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
        {label}
      </Label>

      <div className="relative group">
        <Select
          onValueChange={handleSelect}
          value={safeValue}
          disabled={disabled || loading}
        >
          <SelectTrigger className="w-full min-h-10 bg-background/60 dark:bg-background/40 border border-black/5 dark:border-white/5 px-3 rounded-xl focus:ring-primary/30 outline-none transition-all">
            <SelectValue placeholder={loading ? "Loading..." : placeholder} />
          </SelectTrigger>

          <SelectContent className="bg-card/95 backdrop-blur-3xl border-white/10 rounded-xl">
            {renderCreateForm && (
              <>
                <SelectItem
                  value="__add_new__"
                  className="text-sm font-medium text-primary cursor-pointer focus:bg-primary/10 focus:text-primary"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-3.5 w-3.5" />
                    Add New {label}
                  </div>
                </SelectItem>
                <SelectSeparator className="opacity-50" />
              </>
            )}

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
              <div className="p-4 text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest">
                No options available
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

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
        <p className="text-[10px] text-destructive font-semibold ml-1">
          {error}
        </p>
      )}
    </div>
  );
}
