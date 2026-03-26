"use client";

import { useEffect, useState } from "react";
import { rolesService, Role } from "@/api/roles.service";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Feature, featureService } from "@/api/features.service";

interface Props {
  feature: Feature;
  onSuccess: () => void;
  setLoading: (loading: boolean) => void;
}

export default function FeatureAssignForm({
  feature,
  onSuccess,
  setLoading,
}: Props) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [rolesRes, featureRes] = await Promise.all([
          rolesService.getAll({ status: "active" }),
          featureService.getById(feature.id),
        ]);

        setRoles(rolesRes.data || []);
        if (featureRes.data.roles) {
          setSelectedRoleIds(featureRes.data.roles.map((r) => r.id));
        }
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, [feature.id]);

  const toggleRole = (roleId: number) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await featureService.assignRoles({
        feature_id: feature.id,
        role_ids: selectedRoleIds,
      });
      toast.success("Roles assigned successfully");
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-xs font-bold uppercase opacity-50">
          Syncing Roles...
        </span>
      </div>
    );

  return (
    <form
      id="feature-assign-form"
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {roles.map((role) => (
          <div
            key={role.id}
            className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
          >
            <Checkbox
              id={`role-${role.id}`}
              checked={selectedRoleIds.includes(role.id)}
              onCheckedChange={() => toggleRole(role.id)}
            />
            <div className="grid gap-0.5 leading-none flex-1">
              <Label
                htmlFor={`role-${role.id}`}
                className="text-sm font-bold cursor-pointer"
              >
                {role.name}
              </Label>
              <p className="text-[10px] text-muted-foreground">
                {role.branch?.name} • {role.department?.name || "General"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
