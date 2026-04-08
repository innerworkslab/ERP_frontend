import { api } from "@/lib/axios";
import { ApiResponse, Filters } from "@/types/api.type";

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  status: string;
}

export interface Inventory {
  id: number;
  name: string;
}

export interface StockTransferLine {
  id?: number;
  product_id: number;
  quantity: number | string;
  uom_id: number;
  remarks: string | null;
  product?: {
    id: number;
    name: string;
    sku: string;
    image_url: string;
  };
  uom?: {
    id: number;
    name: string;
    code: string;
  };
}

export interface StockTransfer {
  id: number;
  reference_id: string;
  transfer_date: string;
  source_inventory_id: number;
  target_inventory_id: number;
  remarks: string | null;
  status: "pending" | "confirmed" | "rejected";
  product_count: number;
  created_at: string;
  updated_at: string;
  source_inventory?: Inventory;
  target_inventory?: Inventory;
  created_by?: User;
  confirmed_by?: User | null;
  rejected_by?: User | null;
  confirmed_at?: string | null;
  rejected_at?: string | null;
  lines?: StockTransferLine[];
}

export interface StockTransferPayload {
  transfer_date: string;
  source_inventory_id: number;
  target_inventory_id: number;
  remarks: string | null;
  lines: {
    product_id: number;
    quantity: number;
    uom_id: number;
    remarks: string | null;
  }[];
}

export const stockTransferService = {
  getAll: async (params?: Filters): Promise<ApiResponse<StockTransfer[]>> =>
    await api.get("/v1/stock-transfers", {
      params,
    }),

  getById: async (id: number): Promise<ApiResponse<StockTransfer>> =>
    await api.get(`/v1/stock-transfers/${id}`),

  create: async (
    payload: StockTransferPayload,
  ): Promise<ApiResponse<StockTransfer>> =>
    await api.post("/v1/stock-transfers", payload),

  update: async (
    id: number,
    payload: StockTransferPayload,
  ): Promise<ApiResponse<StockTransfer>> =>
    await api.put(`/v1/stock-transfers/${id}`, payload),

  confirm: async (id: number): Promise<ApiResponse<StockTransfer>> =>
    await api.patch(`/v1/stock-transfers/${id}/confirm`),

  reject: async (id: number): Promise<ApiResponse<StockTransfer>> =>
    await api.patch(`/v1/stock-transfers/${id}/reject`),
};
