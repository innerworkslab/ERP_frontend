"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

type Permission = {
  id: number;
  name: string;
};

type Feature = {
  id: number;
  name: string;
  permissions: Permission[];
};

type Props = {
  data: Feature[];
  value?: number[];
  onChange?: (permission_ids: number[]) => void;
};

export default function PermissionGrid({ data, value, onChange }: Props) {
  const [permissionIds, setPermissionIds] = useState<number[]>([]);

  useEffect(() => {
    if (value) {
      setPermissionIds(value);
    }
  }, [value]);

  const getAction = (name: string, featureName: string) => {
    return name.replace(featureName, "").trim() || name.split(" ")[0];
  };

  const toggle = (id: number) => {
    const updated = permissionIds.includes(id)
      ? permissionIds.filter((i) => i !== id)
      : [...permissionIds, id];

    setPermissionIds(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col gap-1 ml-1">
        <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Access Control & Permissions
        </Label>
        <p className="text-[11px] text-muted-foreground/60 italic">
          Configure what specific actions this staff member can perform.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="divide-y divide-border">
          {data.map((feature) => (
            <div
              key={feature.id}
              className="p-4 transition-colors hover:bg-muted/30 grid grid-cols-1 md:grid-cols-4 gap-4 items-start"
            >
              <div className="md:col-span-1 pt-0.5">
                <p className="text-sm font-medium text-foreground">
                  {feature.name}
                </p>
              </div>

              <div className="md:col-span-3 flex flex-wrap gap-x-6 gap-y-3">
                {feature.permissions.map((p) => (
                  <label
                    key={p.id}
                    className="group flex items-center gap-2.5 text-sm font-normal text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center">
                      <input
                        type="checkbox"
                        checked={permissionIds.includes(p.id)}
                        onChange={() => toggle(p.id)}
                        className="peer h-4 w-4 shrink-0 rounded border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none checked:bg-primary checked:border-primary transition-all"
                      />
                      <svg
                        className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="capitalize">
                      {getAction(p.name, feature.name)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
