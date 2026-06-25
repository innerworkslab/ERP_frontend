import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters } from "@/types/api.type";
import { User } from "./auth.service";

export type GrnFilters = Filters & {
  status?: string;
  search?: string;
};

export type GrnStatus = "pending" | "approved" | "rejected";
export type GrnDeliveryStatus =
  | "not_delivered"
  | "partially_delivered"
  | "fully_delivered";
export type FeeAllocationMethod =
  | "by_line_value"
  | "by_quantity"
  | "by_weight"
  | string;
export type TaxAllocationMethod = "by_products" | "manual" | string;
export type DiscrepancyReason = "none" | "defect" | "shortage" | string;
export type DefectResponsibility =
  | "supplier_side"
  | "carrier_side"
  | "none"
  | string;

export interface GrnCharge {
  id?: number;
  charge_type: string;
  currency_id: number;
  amount: number | string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface GrnLine {
  id?: number;
  goods_receive_note_id?: number;
  purchase_order_line_id: number;
  product_id: number;
  uom_id: number;
  ordered_quantity: number | string;
  received_quantity: number | string;
  good_quantity: number | string;
  unit_price: number | string;
  line_weight: number | string;
  discrepancy_reason: DiscrepancyReason;
  defect_responsibility?: DefectResponsibility;
  remarks?: string | null;
  manual_tax_amount: number | string;
  created_at?: string;
  updated_at?: string;
}

export interface GoodsReceiveNote {
  id: number;
  grn_no: string;
  grn_date: string;
  supplier: string;
  po_no: string;
  branch: string;
  warehouse_location: string;
  delivery_status: GrnDeliveryStatus;
  total_amount: string | number;
  currency: string;
  status: GrnStatus;
  remarks: string | null;
  purchase_order_id?: number;
  supplier_id?: number;
  branch_id?: number;
  inventory_id?: number;
  currency_id?: number;
  fee_allocation_method?: FeeAllocationMethod;
  tax_allocation_method?: TaxAllocationMethod;
  cargo_tax_amount?: string | number;
  discount_amount?: string | number;
  created_by?: User;
  created_at: string;
  updated_at: string;
  charges?: GrnCharge[];
  lines?: GrnLine[];
}

export interface CreateGrnPayload {
  purchase_order_id: number;
  supplier_id: number;
  branch_id: number;
  inventory_id: number;
  currency_id: number;
  grn_date: string;
  fee_allocation_method: FeeAllocationMethod;
  tax_allocation_method: TaxAllocationMethod;
  cargo_tax_amount: number;
  discount_amount: number;
  remarks?: string;
  charges: GrnCharge[];
  lines: GrnLine[];
}

export interface ApproveGrnPayload {
  paid_amount: number;
  cashbook_id: number;
}

export interface GrnListResponse {
  response: {
    status: string;
    message: string;
  };
  data: GoodsReceiveNote[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

export interface GrnSingleResponse {
  response: {
    status: string;
    message: string;
  };
  data: GoodsReceiveNote;
}

export interface ReturnableGrnLineItem {
  goods_receive_note_line_id: number;
  purchase_order_line_id: number;
  product_id: number;
  product_name: string;
  sku: string;
  uom_id: number;
  uom_name: string;
  unit_price: number;
  final_unit_cost: number;
  tax_id: number;
  tax_amount: number;
  grn_good_quantity: number;
  already_returned_quantity: number;
  returnable_quantity: number;
}

export interface ReturnableGrnLinesResponse {
  response: {
    status: string;
    message: string;
  };
  data: {
    goods_receive_note_id: number;
    grn_no: string;
    purchase_order_id: number;
    purchase_order_no: string;
    supplier_id: number;
    supplier_name: string;
    branch_id: number;
    branch_name: string;
    inventory_id: number;
    inventory_name: string;
    currency_id: number;
    currency_code: string;
    lines: ReturnableGrnLineItem[];
  };
}

export interface PoTemplateLineItem {
  purchase_order_line_id: number;
  product_id: number;
  product_name: string;
  sku: string;
  uom_id: number;
  uom_name: string;
  ordered_quantity: number;
  previously_received_quantity: number;
  remaining_quantity: number;
  unit_price: number;
}

export interface PoTemplateResponse {
  response: {
    status: string;
    message: string;
  };
  data: {
    purchase_order_id: number;
    po_no: string;
    po_date: string;
    supplier_id: number;
    supplier_name: string;
    branch_id: number;
    branch_name: string;
    inventory_id: number;
    inventory_name: string;
    currency_id: number;
    currency_code: string;
    currency_rate: number;
    delivery_status: GrnDeliveryStatus;
    lines: PoTemplateLineItem[];
  };
}

const version = "v1";
const endpointToken = API_CONSTANT.GOODS_RECEIVE_NOTE || "goods-receive-notes";
const grnUrl = `/${version}/${endpointToken}`;

export const goodReceiptNotesService = {
  getAll: async (params?: GrnFilters): Promise<GrnListResponse> => {
    return await api.get(`${grnUrl}`, {
      params,
    });
  },

  getById: async (id: number): Promise<GrnSingleResponse> => {
    return await api.get(`${grnUrl}/${id}`);
  },

  create: async (
    payload: CreateGrnPayload,
  ): Promise<ApiResponse<GoodsReceiveNote>> => {
    return await api.post(grnUrl, payload);
  },

  update: async (
    id: number,
    payload: Partial<CreateGrnPayload>,
  ): Promise<ApiResponse<GoodsReceiveNote>> => {
    return await api.put(`${grnUrl}/${id}`, payload);
  },

  approve: async (
    id: number,
    payload: ApproveGrnPayload,
  ): Promise<ApiResponse<GoodsReceiveNote>> => {
    return await api.patch(`${grnUrl}/${id}/approve`, payload);
  },

  reject: async (id: number): Promise<ApiResponse<GoodsReceiveNote>> => {
    return await api.patch(`${grnUrl}/${id}/reject`);
  },

  getReturnableLines: async (
    id: number,
  ): Promise<ReturnableGrnLinesResponse> => {
    return await api.get(`${grnUrl}/${id}/returnable-lines`);
  },

  getPoTemplate: async (
    purchaseOrderId: number,
  ): Promise<PoTemplateResponse> => {
    return await api.get(`${grnUrl}/purchase-orders/${purchaseOrderId}`);
  },
};
