/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters } from "@/types/api.type";
import { User } from "./auth.service";

export type PurchaseReturnFilters = Filters & {
  status?: string;
  search?: string;
};

export type PurchaseReturnStatus = "pending" | "approved" | "rejected";
export type PurchaseReturnType =
  | "exchange"
  | "fully_returned"
  | "partially_returned";

export interface PurchaseReturnLinePayload {
  goods_receive_note_line_id: number;
  return_quantity: number;
  reason: string;
  remarks?: string;
}

export interface PurchaseReturnLineItem extends PurchaseReturnLinePayload {
  id: number;
  purchase_return_id: number;
  purchase_order_line_id: number;
  product_id: number;
  uom_id: number;
  tax_id: number;
  grn_good_quantity: string;
  already_returned_quantity: string;
  returnable_quantity: string;
  unit_price: string;
  final_unit_cost: string;
  tax_amount: string;
  line_total: string;
  created_at: string;
  updated_at: string;
  product?: {
    id: number;
    name: string;
    sku: string;
    image: string;
    image_path: string;
    image_url: string;
    status: string;
  };
  uom?: {
    id: number;
    name: string;
    code: string;
    status: string;
  };
  tax?: {
    id: number;
    category: string;
    code: string;
    type: string;
    amount: string;
  };
  goods_receive_note_line?: {
    id: number;
    goods_receive_note_id: number;
    ordered_quantity: string;
    received_quantity: string;
    good_quantity: string;
    short_quantity: string;
    unit_price: string;
    line_total: string;
  };
}

export interface PurchaseReturnSummary {
  id: number;
  return_no: string;
  return_date: string;
  grn_no: string;
  po_no: string;
  supplier: string;
  branch: string;
  inventory: string;
  currency: string;
  return_type: PurchaseReturnType;
  total_amount: string;
  status: PurchaseReturnStatus;
}

export interface PurchaseReturnDetail {
  id: number;
  return_no: string;
  goods_receive_note_id: number;
  purchase_order_id: number;
  supplier_id: number;
  branch_id: number;
  inventory_id: number;
  currency_id: number;
  exchange_goods_receive_note_id: number | null;
  return_date: string;
  return_type: PurchaseReturnType;
  subtotal_amount: string;
  tax_amount: string;
  total_amount: string;
  remarks: string | null;
  status: PurchaseReturnStatus;
  created_by: User;
  approved_by: User | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  goods_receive_note?: {
    id: number;
    grn_no: string;
    total_amount: string;
    status: string;
  };
  purchase_order?: {
    id: number;
    po_number: string;
    status: string;
    payment_status: string;
    delivery_status: string;
  };
  supplier?: {
    id: number;
    code: string;
    name: string;
    company_name: string;
  };
  branch?: {
    id: number;
    name: string;
  };
  inventory?: {
    id: number;
    name: string;
  };
  currency?: {
    id: number;
    name: string;
    code: string;
    symbol: string;
  };
  exchange_goods_receive_note: any | null;
  lines: PurchaseReturnLineItem[];
}

export interface CreatePurchaseReturnPayload {
  goods_receive_note_id: number;
  return_date: string;
  return_type: PurchaseReturnType | string;
  remarks?: string;
  lines: PurchaseReturnLinePayload[];
}

export interface PurchaseReturnListResponse {
  response: {
    status: string;
    message: string;
  };
  data: PurchaseReturnSummary[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

export interface PurchaseReturnSingleResponse {
  response: {
    status: string;
    message: string;
  };
  data: PurchaseReturnDetail;
}

const version = "v1";
const endpointToken =
  (API_CONSTANT as any).PURCHASE_RETURN || "purchase-returns";
const purchaseReturnUrl = `/${version}/${endpointToken}`;

export const purchaseReturnService = {
  getAll: async (
    params?: PurchaseReturnFilters,
  ): Promise<PurchaseReturnListResponse> => {
    return await api.get(purchaseReturnUrl, { params });
  },

  getById: async (id: number): Promise<PurchaseReturnSingleResponse> => {
    return await api.get(`${purchaseReturnUrl}/${id}`);
  },

  create: async (
    payload: CreatePurchaseReturnPayload,
  ): Promise<ApiResponse<PurchaseReturnDetail>> => {
    return await api.post(purchaseReturnUrl, payload);
  },

  update: async (
    id: number,
    payload: Partial<CreatePurchaseReturnPayload>,
  ): Promise<ApiResponse<PurchaseReturnDetail>> => {
    return await api.put(`${purchaseReturnUrl}/${id}`, payload);
  },

  approve: async (id: number): Promise<ApiResponse<any>> => {
    return await api.patch(`${purchaseReturnUrl}/${id}/approve`);
  },

  reject: async (id: number): Promise<ApiResponse<any>> => {
    return await api.patch(`${purchaseReturnUrl}/${id}/reject`);
  },
};
