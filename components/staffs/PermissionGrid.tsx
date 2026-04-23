"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

type Permission = {
  id: number;
  name: string;
};

type Feature = {
  feature_id: number;
  feature_name: string;
  permissions: Permission[];
};

type Props = {
  data: Feature[];
  onChange?: (permission_ids: number[]) => void;
};

export default function PermissionGrid({ data, onChange }: Props) {
  const [permissionIds, setPermissionIds] = useState<number[]>([]);

  useEffect(() => {
    if (data?.length) {
      const allIds = data.flatMap((f) => f.permissions.map((p) => p.id));

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPermissionIds(allIds);
      onChange?.(allIds);
    }
  }, [data]);

  const getAction = (name: string) => name.split(" ")[0];

  const toggle = (id: number) => {
    const updated = permissionIds.includes(id)
      ? permissionIds.filter((i) => i !== id)
      : [...permissionIds, id];

    setPermissionIds(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-2 w-full">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
        Permissions
      </Label>

      <div className="bg-background/50 rounded-2xl p-4 space-y-4">
        {data.map((feature) => (
          <div key={feature.feature_id} className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground/80">
              {feature.feature_name}
            </p>

            <div className="flex flex-wrap gap-3">
              {feature.permissions.map((p) => (
                <label
                  key={p.id}
                  className="flex items-center gap-2 text-sm text-foreground/90 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={permissionIds.includes(p.id)}
                    onChange={() => toggle(p.id)}
                    className="h-4 w-4 rounded-md border-muted-foreground/30 
                      text-primary focus:ring-primary/30 transition"
                  />
                  {getAction(p.name)}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
