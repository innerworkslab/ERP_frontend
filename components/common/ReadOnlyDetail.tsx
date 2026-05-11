/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatPrice } from "@/utils/helper.utils";
import { Label } from "../ui/label";

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
    | "currency"
    | "discountGroup"
    | "brand"
    | "category"
    | "tax"
    | "originCountry"
    | "product"
    | "inventory"
    | "collection"
    | "openingStock"
    | "stockTransfer"
    | "stockBalance"
    | "customer";
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
        {/* BRANCH TYPE */}
        {type === "branch" && data && (
          <>
            <DetailItem label="Branch Name" value={data.name} fullWidth />

            <div className="grid grid-cols-2 gap-4 col-span-2">
              <DetailItem label="Status" value={StatusBadge} />
              <DetailItem
                label="Prefix"
                value={
                  <span className="font-mono text-primary font-bold">
                    {data.prefix}
                  </span>
                }
              />

              <div className="col-span-2">
                <DetailItem label="Address" value={data.address} fullWidth />
              </div>

              <DetailItem label="Email Address" value={data.email || "N/A"} />

              <DetailItem
                label="Mobile Phones"
                value={
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.mobile_phones?.map((phone: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-[10px] font-mono"
                      >
                        {phone}
                      </Badge>
                    )) || "N/A"}
                  </div>
                }
              />

              {data.website && (
                <DetailItem
                  label="Website"
                  value={
                    <a
                      href={data.website}
                      target="_blank"
                      className="text-primary hover:underline truncate inline-block w-full"
                    >
                      {data.website}
                    </a>
                  }
                />
              )}

              {data.facebook && (
                <DetailItem
                  label="Facebook"
                  value={
                    <span className="truncate inline-block w-full">
                      {data.facebook}
                    </span>
                  }
                />
              )}

              <DetailItem
                label="State / Region"
                value={data.state?.name || data.state_id || "N/A"}
              />
              <DetailItem
                label="City"
                value={data.city?.name || data.city_id || "N/A"}
              />

              {(data.latitude || data.longitude) && (
                <DetailItem
                  label="Coordinates (Lat, Long)"
                  value={`${data.latitude || "0"}, ${data.longitude || "0"}`}
                  fullWidth
                />
              )}
            </div>
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
              label="Categories"
              fullWidth
              value={
                <div className="flex flex-wrap gap-1">
                  {data.product_categories?.map((cat: any) => (
                    <Badge
                      key={cat.id}
                      variant="outline"
                      className="bg-primary/5 text-primary border-primary/20"
                    >
                      {cat.name}
                    </Badge>
                  )) || "N/A"}
                </div>
              }
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

        {/* UOM CONVERSION */}
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

        {/* CURRENCY */}
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

        {/* DISCOUNT GROUP */}
        {type === "discountGroup" && (
          <>
            <DetailItem label="Group Name" value={data.name} fullWidth />
            <DetailItem
              label="Customer Type"
              value={data.customer_type?.name}
            />
            <DetailItem label="Branch" value={data.branch?.name} />
            <DetailItem
              label="Active Status"
              value={data.is_active ? "Active" : "Inactive"}
            />
            <DetailItem
              label="Created At"
              value={formatDate(data.created_at)}
              fullWidth
            />
          </>
        )}

        {/* BRAND */}
        {type === "brand" && (
          <>
            <DetailItem label="Brand Name" value={data.name} fullWidth />
            <DetailItem label="Status" value={StatusBadge} />
            <DetailItem
              label="Description"
              value={data.description}
              fullWidth
            />
          </>
        )}

        {/* CATEGORY */}
        {type === "category" && (
          <>
            <DetailItem label="Category Name" value={data.name} fullWidth />
            <DetailItem label="Status" value={StatusBadge} />
            <DetailItem
              label="Description"
              value={data.description}
              fullWidth
            />
          </>
        )}

        {/* TAX */}
        {type === "tax" && (
          <>
            <DetailItem label="Tax Category" value={data.category} fullWidth />
            <DetailItem label="Tax Code" value={data.code} />
            <DetailItem label="Tax Type" value={data.type} />
            <DetailItem
              label="Amount (%)"
              value={Number(data.amount).toFixed(2)}
              fullWidth
            />
            <DetailItem label="Status" value={StatusBadge} />
          </>
        )}

        {/* ORIGIN COUNTRY */}
        {type === "originCountry" && (
          <>
            <DetailItem label="Country Name" value={data.name} fullWidth />
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

        {type === "product" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="w-32 h-32 rounded-xl border bg-muted overflow-hidden flex-shrink-0">
                {data.image_url ? (
                  <img
                    src={data.image_url}
                    alt={data.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] font-bold uppercase">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-bold">{data.name}</h2>
                <p className="text-sm font-mono text-muted-foreground uppercase">
                  {data.sku}
                </p>
                <div className="mt-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${data.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}
                  >
                    {data.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem label="Product Name" value={data.name} fullWidth />
              <DetailItem label="SKU / Barcode" value={data.sku} />
              <DetailItem label="Category" value={data.category?.name} />
              <DetailItem label="Brand" value={data.brand?.name} />
              <DetailItem
                label="Origin Country"
                value={data.origin_country?.name}
              />
              <DetailItem label="Alert Quantity" value={data.alert_quantity} />

              <div className="col-span-2 border-t pt-4 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailItem
                    label="Purchase Price"
                    value={formatPrice(
                      data.purchase_price,
                      data.purchase_currency?.symbol,
                    )}
                  />
                  <DetailItem
                    label="Purchase Unit"
                    value={data.purchase_uom?.name}
                  />
                  <DetailItem
                    label="Purchase Currency"
                    value={data.purchase_currency?.name}
                  />
                  <DetailItem
                    label="Purchase Tax"
                    value={data.purchase_tax?.category}
                  />
                </div>
              </div>

              <div className="col-span-2 border-t pt-4 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailItem
                    label="Sale Price"
                    value={formatPrice(
                      data.sale_price,
                      data.sale_currency?.symbol,
                    )}
                  />
                  <DetailItem label="Sale Unit" value={data.sale_uom?.name} />
                  <DetailItem
                    label="Sale Currency"
                    value={data.sale_currency?.name}
                  />
                  <DetailItem
                    label="Sale Tax"
                    value={data.sale_tax?.category}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY */}
        {type === "inventory" && (
          <>
            <DetailItem label="Inventory Name" value={data.name} fullWidth />
            <DetailItem
              label="Branches"
              value={
                data.branches?.length > 0
                  ? data.branches.map((b: any) => b.name).join(", ")
                  : "-"
              }
              fullWidth
            />
          </>
        )}

        {/* COLLECTION */}
        {type === "collection" && data && (
          <>
            <DetailItem label="Collection Name" value={data.name} fullWidth />

            <div className="grid grid-cols-2 gap-4 col-span-2">
              <DetailItem
                label="Purchase Price"
                value={`${data.purchase_currency?.symbol || ""} ${data.purchase_price}`}
              />
              <DetailItem
                label="Currency"
                value={`${data.purchase_currency?.name} (${data.purchase_currency?.code})`}
              />

              <DetailItem
                label="Sale Price"
                value={`${data.sale_currency?.symbol || ""} ${data.sale_price}`}
              />
              <DetailItem
                label="Currency"
                value={`${data.sale_currency?.name} (${data.sale_currency?.code})`}
              />
            </div>
          </>
        )}

        {type === "openingStock" && data && (
          <>
            {/* Header Information */}
            <div className="grid grid-cols-2 gap-4 col-span-2">
              <DetailItem label="Voucher No" value={data.voucher_no} />
              <DetailItem label="Voucher Date" value={data.voucher_date} />

              <DetailItem
                label="Warehouse / Inventory"
                value={data.inventory?.name || "N/A"}
              />
              <DetailItem label="Status" value={data.status} />

              <DetailItem
                label="Remarks"
                value={data.remarks || "-"}
                fullWidth
              />
            </div>

            {/* Voucher Lines Table */}
            <div className="col-span-2 mt-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary px-1">
                Voucher Items
              </h3>
              <div className="rounded-2xl border border-white/5 bg-card/30 overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-muted/50 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-center">Unit</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.lines?.map((line: any, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">
                          {line.product?.name || `Product #${line.product_id}`}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {line.quantity}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-2 py-0"
                          >
                            {line.uom?.name || "Units"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {Number(line.purchase_price).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-primary">
                          {Number(line.subtotal).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end items-center">
                <span className="px-4 py-4 text-right text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                  Total
                </span>
                <span className="px-4 py-4 text-right text-lg font-black text-primary">
                  {Number(data.total_amount).toLocaleString()}
                </span>
              </div>
            </div>
          </>
        )}

        {/* STOCK TRANSFER */}
        {type === "stockTransfer" && data && (
          <>
            <DetailItem
              label="Reference ID"
              value={data.reference_id}
              fullWidth
            />

            <div className="grid grid-cols-2 gap-4 col-span-2">
              <DetailItem label="Transfer Date" value={data.transfer_date} />
              <DetailItem label="Status" value={data.status?.toUpperCase()} />

              <DetailItem
                label="Source Warehouse"
                value={data.source_inventory?.name || "N/A"}
              />
              <DetailItem
                label="Target Warehouse"
                value={data.target_inventory?.name || "N/A"}
              />

              <div className="col-span-2">
                <DetailItem
                  label="Remarks"
                  value={data.remarks || "No remarks"}
                  fullWidth
                />
              </div>
            </div>

            {/* ITEM MANIFEST */}
            <div className="col-span-2 mt-4 space-y-3">
              <h3 className="text-[10px] font-black uppercase text-primary tracking-[0.2em] px-1">
                Items ({data.lines?.length || 0})
              </h3>
              <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3 text-right">Qty</th>
                      <th className="px-4 py-3">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.lines?.map((line: any, idx: number) => (
                      <tr key={idx} className="text-xs">
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-bold">
                              {line.product?.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-black text-primary">
                          {line.quantity}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {line.uom?.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* STOCK BALANCE */}
        {type === "stockBalance" && data && (
          <>
            <div className="flex items-center gap-4 col-span-2 mb-2">
              {data.product_image && (
                <img
                  src={data.product_image}
                  className="h-16 w-16 rounded-2xl border border-white/5 object-cover"
                />
              )}
              <div>
                <h2 className="text-lg font-black uppercase tracking-tighter">
                  {data.product_name}
                </h2>
                <p className="text-xs text-muted-foreground font-mono">
                  {data.sku}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 col-span-2">
              <DetailItem label="Warehouse" value={data.inventory_name} />
              <DetailItem label="Branch" value={data.branch_names} />

              <DetailItem
                label="On Hand"
                value={
                  <span className="font-black text-primary">
                    {data.on_hand_quantity} {data.stock_uom}
                  </span>
                }
              />
              <DetailItem
                label="Available"
                value={
                  <span className="font-black text-emerald-500">
                    {data.available_quantity} {data.stock_uom}
                  </span>
                }
              />

              <DetailItem label="Lot Number" value={data.lot_no || "N/A"} />
              <DetailItem
                label="Serial Number"
                value={data.serial_no || "N/A"}
              />

              <DetailItem
                label="Expiry Date"
                value={data.expired_date || "No Expiry"}
              />
              <DetailItem label="Reorder Level" value={data.reorder_level} />
            </div>

            {/* VALUATION BOX */}
            <div className="col-span-2 mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Total Inventory Value
                </span>
                <span className="text-xl font-black text-primary">
                  {Number(data.total_stock_value).toLocaleString()}
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-1 uppercase">
                Calculated at unit cost of {Number(data.unit_cost).toFixed(2)}
              </p>
            </div>
          </>
        )}

        {/* CUSTOMER */}
        {type === "customer" && (
          <>
            <DetailItem label="Customer Name" value={data.name} fullWidth />
            <DetailItem
              label="Company Name"
              value={data.company_name}
              fullWidth
            />
            <DetailItem label="Phone Number" value={data.phone_number} />
            <DetailItem
              label="Customer Type"
              value={data.customer_type?.name}
            />
            <DetailItem label="Status" value={data.status} />
            <DetailItem
              label="Birthday"
              value={data.birthday ? formatDate(data.birthday) : "N/A"}
            />

            <DetailItem label="Address" value={data.address} fullWidth />
            <DetailItem label="City" value={data.city?.name} />
            <DetailItem label="State" value={data.state?.name} />

            <DetailItem
              label="Branches"
              value={data.branches?.map((b: any) => b.name).join(", ") || "N/A"}
              fullWidth
            />

            <DetailItem
              label="Credit Limit"
              value={Number(data.credit_limit).toLocaleString()}
            />
            <DetailItem
              label="Opening Balance"
              value={Number(data.opening).toLocaleString()}
            />

            {data?.bank_accounts && data.bank_accounts.length > 0 && (
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  Bank Account Details
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.bank_accounts.map((bank, index: number) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-1"
                    >
                      <p className="text-xs text-muted-foreground uppercase font-medium">
                        {bank.bank_name}
                      </p>
                      <p className="text-sm font-bold tracking-tight">
                        {bank.account_number}
                      </p>
                      <p className="text-[10px] text-muted-foreground italic">
                        {bank.holder_name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
