/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils/helper.utils";

const DetailItem = ({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: ReactNode;
  fullWidth?: boolean;
}) => (
  <div
    className={`flex items-start gap-3 py-1 ${fullWidth ? "col-span-2" : "col-span-1"}`}
  >
    <div className="space-y-0.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
        {label}
      </p>
      <div className="text-sm font-semibold text-foreground leading-snug">
        {value || "—"}
      </div>
    </div>
  </div>
);

export function ReadOnlyDetail({
  data,
  type,
}: {
  data: any;
  type:
    | "branch"
    | "department"
    | "role"
    | "feature"
    | "priceGroup"
    | "customerType"
    | "variation"
    | "uom"
    | "uomConversion"
    | "currency";
}) {
  if (!data) return null;

  const StatusBadge = (
    <Badge
      variant="outline"
      className={`capitalize font-bold text-[9px] px-2 py-0 h-5 ${
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
        {/*BRANCH TYPE*/}
        {type === "branch" && (
          <>
            <DetailItem label="Branch Name" value={data.name} fullWidth />
            <DetailItem label="Status" value={StatusBadge} />
            <DetailItem
              label="Prefix"
              value={
                <span className="font-mono text-primary">{data.prefix}</span>
              }
            />
            <DetailItem label="Location" value={data.location} fullWidth />
          </>
        )}

        {/*DEPARTMENT TYPE*/}
        {type === "department" && (
          <>
            <DetailItem label="Department Name" value={data.name} fullWidth />
            <DetailItem label="Status" value={StatusBadge} />
            <DetailItem
              label="Dept Code"
              value={
                <span className="font-mono text-primary">{data.code}</span>
              }
            />
            <DetailItem label="Branch" value={data.branch?.name} />
            <DetailItem
              label="Description"
              value={data.description}
              fullWidth
            />
          </>
        )}

        {/*ROLE TYPE*/}
        {type === "role" && (
          <>
            <DetailItem label="Role Name" value={data.name} fullWidth />
            <DetailItem label="Status" value={StatusBadge} />
            <DetailItem
              label="Parent Role"
              value={data.parent_role?.name || "Organization Root"}
            />
            <DetailItem label="Branch" value={data.branch?.name} />
            <DetailItem label="Department" value={data.department?.name} />
            <DetailItem
              label="Assigned Features"
              value={
                data.features?.length > 0
                  ? data.features.map((f: any) => f.name).join(", ")
                  : "-"
              }
              fullWidth
            />
          </>
        )}

        {/*FEATURE TYPE*/}
        {type === "feature" && (
          <>
            <DetailItem label="Feature Name" value={data.name} fullWidth />
            <DetailItem label="Status" value={StatusBadge} />
            <DetailItem label="Module" value={data.module} />
            <DetailItem
              label="Key"
              value={<span className="font-mono text-xs">{data.key}</span>}
            />
            <DetailItem
              label="Description"
              value={data.description}
              fullWidth
            />
            <DetailItem
              label="Related Roles"
              value={
                data.roles?.length > 0
                  ? data.roles.map((r: any) => r.name).join(", ")
                  : "-"
              }
              fullWidth
            />
            <DetailItem
              label="Permissions"
              value={
                data.permissions?.length > 0
                  ? data.permissions.map((p: any) => p.name).join(" • ")
                  : "-"
              }
              fullWidth
            />
          </>
        )}

        {/* PRICE GROUP TYPE */}
        {type === "priceGroup" && (
          <>
            <DetailItem label="Group Name" value={data.name} fullWidth />
            <DetailItem label="Status" value={StatusBadge} />
            <DetailItem label="Branch" value={data.branch?.name || "-"} />
            <DetailItem
              label="Customer Type"
              value={data.customer_type?.name || "-"}
            />
            <DetailItem
              label="Created At"
              value={new Date(data.created_at).toLocaleDateString()}
            />
            <DetailItem
              label="Last Updated"
              value={new Date(data.updated_at).toLocaleDateString()}
            />
            <DetailItem
              label="Branch Location"
              value={data.branch?.location || "-"}
              fullWidth
            />
          </>
        )}

        {/* CUSTOMER TYPE */}
        {type === "customerType" && (
          <>
            <DetailItem label="Type Name" value={data.name} fullWidth />
            <DetailItem label="Status" value={StatusBadge} />
            <DetailItem
              label="System ID"
              value={<span className="font-mono text-xs">#{data.id}</span>}
            />
            <DetailItem label="Last Sync" value={formatDate(data.updated_at)} />
          </>
        )}

        {/* VARIATION */}
        {type === "variation" && (
          <>
            <DetailItem label="Variation Name" value={data.name} fullWidth />
            <DetailItem label="Status" value={StatusBadge} />
            <DetailItem
              label="Data Type"
              value={<Badge variant="secondary">{data.value_data_type}</Badge>}
            />
            <DetailItem
              label="Last Modified By"
              value={data.updated_by?.name || "N/A"}
            />
            <DetailItem
              label="Created Date"
              value={formatDate(data.created_at)}
              fullWidth
            />
          </>
        )}

        {/* UOM */}
        {type === "uom" && (
          <>
            <DetailItem label="UOM Name" value={data.name} fullWidth />
            <DetailItem
              label="UOM Code"
              value={<Badge variant="secondary">{data.code}</Badge>}
            />
            <DetailItem label="Status" value={StatusBadge} />
            <DetailItem
              label="Created By"
              value={data.created_by?.name || "System"}
            />
            <DetailItem
              label="Last Modified By"
              value={data.updated_by?.name || "N/A"}
            />
            <DetailItem
              label="Created Date"
              value={formatDate(data.created_at)}
              fullWidth
            />
          </>
        )}

        {type === "uomConversion" && (
          <>
            <DetailItem label="Base Unit ID" value={data.base_unit_id} />
            <DetailItem
              label="Conversion Unit ID"
              value={data.conversion_unit_id}
            />
            <DetailItem
              label="Conversion Rate"
              value={Number(data.conversion_rate).toFixed(2)}
              fullWidth
            />
            <DetailItem label="Status" value={StatusBadge} />
            <DetailItem
              label="Created By"
              value={data.created_by?.name || "System"}
            />
            <DetailItem
              label="Created Date"
              value={formatDate(data.created_at)}
              fullWidth
            />
          </>
        )}

        {type === "currency" && (
          <>
            <DetailItem label="Currency Name" value={data.name} fullWidth />
            <DetailItem label="Currency Code" value={data.code} />
            <DetailItem label="Symbol" value={data.symbol} />
            <DetailItem
              label="Exchange Rate"
              value={Number(data.exchange_rate).toFixed(4)}
              fullWidth
            />
            <DetailItem
              label="Base Currency"
              value={data.is_base_currency ? "Yes" : "No"}
            />
            <DetailItem
              label="Last Rate Update"
              value={
                data.last_exchange_rate_update
                  ? formatDate(data.last_exchange_rate_update)
                  : "Never"
              }
            />
          </>
        )}
      </div>

      <Separator className="opacity-40" />

      {/*METADATA FOOTER*/}
      <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Creator
          </p>
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            {data.created_by?.name || "System"}
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Created At
          </p>
          <p className="text-sm font-medium text-foreground italic">
            {formatDate(data.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
