/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DetailItemProps {
  label: string;
  value: ReactNode;
  fullWidth?: boolean;
}

const DetailItem = ({ label, value, fullWidth }: DetailItemProps) => (
  <div
    className={`flex items-start gap-3 py-1 ${fullWidth ? "col-span-2" : "col-span-1"}`}
  >
    <div className="space-y-0.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
        {label}
      </p>
      <div className="text-sm font-semibold text-foreground leading-snug">
        {value || "—"}
      </div>
    </div>
  </div>
);

interface ReadOnlyDetailProps {
  data: any;
  type: "branch" | "department" | "role";
}

export function ReadOnlyDetail({ data, type }: ReadOnlyDetailProps) {
  if (!data) return null;

  const StatusBadge = (
    <Badge
      variant="outline"
      className={`capitalize font-bold text-[9px] px-2 py-0 h-5 tracking-wide ${
        data.status === "active"
          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          : "bg-slate-500/10 text-slate-400 border-slate-500/20"
      }`}
    >
      {data.status}
    </Badge>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        {type === "branch" && (
          <>
            <DetailItem
              label="Status"
              value={StatusBadge}
            />
            <DetailItem
              label="Prefix"
              value={
                <span className="font-mono text-primary">{data.prefix}</span>
              }
            />
            <DetailItem
              label="Branch Name"
              value={data.name}
              fullWidth
            />
            <DetailItem
              label="Location"
              value={data.location}
              fullWidth
            />
          </>
        )}

        {type === "department" && (
          <>
            <DetailItem
              label="Status"
              value={StatusBadge}
            />
            <DetailItem
              label="Dept Code"
              value={
                <span className="font-mono text-primary">{data.code}</span>
              }
            />
            <DetailItem
              label="Department Name"
              value={data.name}
              fullWidth
            />
            <DetailItem
              label="Branch"
              value={data.branch?.name}
              fullWidth
            />
          </>
        )}

        {type === "role" && (
          <>
            <DetailItem
              label="Role"
              value={data.name}
            />
            <DetailItem
              label="Status"
              value={StatusBadge}
            />
            <DetailItem
              label="Branch"
              value={data.branch?.name}
            />
            <DetailItem
              label="Department"
              value={data.department?.name}
            />
            <DetailItem
              label="Reports To"
              value={data.parent_role?.name || "Organization Root"}
              fullWidth
            />
          </>
        )}
      </div>

      <div className="pt-2">
        <Separator className="opacity-40" />
      </div>

      <div className="grid grid-cols-2 gap-4 bg-muted/20 p-3 rounded-xl border border-border/40">
        <DetailItem
          label="Created By"
          value={data.created_by?.name || "System"}
        />
        <DetailItem
          label="Created At"
          value={data.created_at || "-"}
        />
      </div>
    </div>
  );
}
