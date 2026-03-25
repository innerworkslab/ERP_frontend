"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerTypeService, CustomerType } from "@/api/customerTypes.service";
import { toast } from "sonner";
import { CustomerTypeFormValues, customerTypeSchema } from "./schema";

interface Props {
  initialData?: CustomerType | null;
  onSuccess: () => void;
  setLoading: (loading: boolean) => void;
}

export default function CustomerTypeForm({
  initialData,
  onSuccess,
  setLoading,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerTypeFormValues>({
    resolver: zodResolver(customerTypeSchema),
    defaultValues: { name: initialData?.name || "" },
  });

  const onSubmit = async (values: CustomerTypeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await customerTypeService.update(initialData.id, values);
        toast.success("Customer type updated");
      } else {
        await customerTypeService.create(values);
        toast.success("Customer type created");
      }
      onSuccess();
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="customer-type-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="space-y-1">
        <label className="text-sm font-medium">Type Name</label>
        <input
          {...register("name")}
          className="w-full h-11 px-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
          placeholder="e.g. Wholesale, VIP"
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>
    </form>
  );
}
