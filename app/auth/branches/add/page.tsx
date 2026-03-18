"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Loader2, MapPin, Building2, Hash, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const branchSchema = yup
  .object({
    prefix: yup
      .string()
      .required("Prefix is required")
      .min(2, "Min 2 characters")
      .max(5, "Max 5 characters")
      .matches(/^[A-Z0-9]+$/, "Must be uppercase alphanumeric"),
    name: yup
      .string()
      .required("Branch name is required")
      .min(3, "Name is too short"),
    location: yup
      .string()
      .required("Location is required")
      .min(5, "Please provide a more detailed location"),
    status: yup
      .string()
      .oneOf(["active", "inactive"], "Invalid status")
      .required("Status is required"),
  })
  .required();

type BranchFormValues = yup.InferType<typeof branchSchema>;

export default function AddBranchPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormValues>({
    resolver: yupResolver(branchSchema),
    defaultValues: {
      status: "active",
    },
  });

  const onSubmit = async (data: BranchFormValues) => {
    try {
      console.log("Payload:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-top">
          <div className="space-y-1.5 w-full">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
              Branch Prefix
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
              <Input
                {...register("prefix")}
                placeholder="e.g. YGN"
                className={`pl-9 bg-background/60 dark:bg-background/40 border border-black/5 dark:border-white/5 h-10 focus-visible:ring-primary/30 rounded-xl transition-all ${
                  errors.prefix
                    ? "border-destructive/50 ring-1 ring-destructive/20"
                    : ""
                }`}
              />
            </div>
            {errors.prefix && (
              <p className="text-[10px] text-destructive font-semibold ml-1">
                {errors.prefix.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5 w-full">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
              Operational Status
            </label>
            <Select
              onValueChange={(value) =>
                setValue("status", value as "active" | "inactive")
              }
              defaultValue="active"
            >
              <SelectTrigger className="w-full min-h-10 mb-0 bg-background/60 dark:bg-background/40 border border-black/5 dark:border-white/5 px-3 rounded-xl focus:ring-primary/30 outline-none">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-3xl border-white/10 rounded-xl">
                <SelectItem value="active" className="text-sm">
                  Active
                </SelectItem>
                <SelectItem value="inactive" className="text-sm">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-[10px] text-destructive font-semibold ml-1">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-1.5 w-full">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
              Branch Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
              <Input
                {...register("name")}
                placeholder="e.g. Yangon Main Branch"
                className={`pl-9 bg-background/60 dark:bg-background/40 border border-black/5 dark:border-white/5 h-10 focus-visible:ring-primary/30 rounded-xl transition-all ${
                  errors.name
                    ? "border-destructive/50 ring-1 ring-destructive/20"
                    : ""
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-[10px] text-destructive font-semibold ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5 w-full">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
              Location Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
              <Input
                {...register("location")}
                placeholder="City, Street address or Coordinates"
                className={`pl-9 bg-background/60 dark:bg-background/40 border border-black/5 dark:border-white/5 h-10 focus-visible:ring-primary/30 rounded-xl transition-all ${
                  errors.location
                    ? "border-destructive/50 ring-1 ring-destructive/20"
                    : ""
                }`}
              />
            </div>
            {errors.location && (
              <p className="text-[10px] text-destructive font-semibold ml-1">
                {errors.location.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-8 text-xs font-bold rounded-xl transition-all active:scale-[0.95] bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Saving..." : "Create Branch"}
          </Button>
        </div>
      </form>
    </div>
  );
}
