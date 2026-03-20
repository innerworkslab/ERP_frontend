"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Loader2, Building2, Hash, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departmentSchema } from "./schema";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { departmentService } from "@/api/departments.service";
import { toast } from "sonner";
import { branchService } from "@/api/branches.service";

type DepartmentFormValues = yup.InferType<typeof departmentSchema>;

type Branch = {
  id: number;
  name: string;
};

export default function DepartmentForm() {
  const router = useRouter();
  const params = useParams();

  const idParam = params?.id;
  const idValue = Array.isArray(idParam) ? idParam[0] : idParam;
  const isUpdate = !!idValue && idValue !== "add";
  const numericId = isUpdate ? Number(idValue) : null;

  const [branches, setBranches] = useState<Branch[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormValues>({
    resolver: yupResolver(departmentSchema),
    defaultValues: {
      status: "active",
    },
  });

  const currentStatus = watch("status");

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await branchService.getAll();
        const branchList = res.data.map((item: Branch) => item);
        setBranches(branchList);
      } catch (error) {
        console.error("Failed to fetch branches", error);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    if (isUpdate && numericId) {
      const fetchDepartment = async () => {
        const res = await departmentService.getById(numericId);

        if (res && res.data) {
          reset({
            code: res.data.code || "",
            name: res.data.name || "",
            branch_id: res.data.branch.id || 0,
            status: res.data.status || "active",
          });
        }
      };
      fetchDepartment();
    }
  }, [numericId, isUpdate, reset]);

  const onSubmit = async (data: DepartmentFormValues) => {
    const res =
      isUpdate && numericId
        ? await departmentService.update(numericId, data)
        : await departmentService.create(data);

    toast.success(res.response?.message || "Success");
    router.push("/auth/departments");
    router.refresh();
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-top">
          <div className="space-y-1.5 w-full">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
              Code
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
              <Input
                {...register("code")}
                placeholder="e.g. ITD"
                className={`pl-9 bg-background/60 dark:bg-background/40 border border-black/5 dark:border-white/5 h-10 focus-visible:ring-primary/30 rounded-xl transition-all ${
                  errors.code
                    ? "border-destructive/50 ring-1 ring-destructive/20"
                    : ""
                }`}
              />
            </div>
            {errors.code && (
              <p className="text-[10px] text-destructive font-semibold ml-1">
                {errors.code.message}
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
              value={currentStatus || "active"}
            >
              <SelectTrigger className="w-full min-h-10 bg-background/60 dark:bg-background/40 border border-black/5 dark:border-white/5 px-3 rounded-xl focus:ring-primary/30 outline-none">
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
              Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
              <Input
                {...register("name")}
                placeholder="e.g. IT Department"
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
              Branch
            </label>
            <Select
              value={watch("branch_id")?.toString()}
              onValueChange={(value) => setValue("branch_id", Number(value))}
            >
              <SelectTrigger className="w-full min-h-10 mb-0 bg-background/60 dark:bg-background/40 border border-black/5 dark:border-white/5 px-3 rounded-xl focus:ring-primary/30 outline-none">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>

              <SelectContent className="bg-card/95 backdrop-blur-3xl border-white/10 rounded-xl">
                {branches.map((branch) => (
                  <SelectItem
                    key={branch.id}
                    value={String(branch.id)}
                    className="text-sm"
                  >
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.branch_id && (
              <p className="text-[10px] text-destructive font-semibold ml-1">
                {errors.branch_id.message}
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
            {isSubmitting ? "Saving..." : "Create Department"}
          </Button>
        </div>
      </form>
    </div>
  );
}
