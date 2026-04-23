import { api } from "@/lib/axios";
import { ApiResponse, Filters, PaginationMeta } from "@/types/api.type";

export interface OpeningStockLine {
  id?: number;
  product_id: number;
  quantity: number;
  uom_id: number;
  purchase_price: number;
  subtotal: number;
  lot_no?: string | null;
  expired_date?: string | null;
  serial_no?: string | null;
  remarks?: string | null;
  product?: { name: string; sku: string };
  unit?: { name: string; code: string };
}

export interface OpeningStock {
  id: number;
  voucher_no: string;
  voucher_date: string;
  inventory_id: number;
  status: "pending" | "confirmed";
  remarks: string | null;
  total_amount: string | number;
  inventory: { id: number; name: string };
  created_at: string;
  lines?: OpeningStockLine[];
}

export interface OpeningStockResponse {
  response: {
    status: string;
    message: string;
  };
  data: OpeningStock[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

export interface OpeningStockRequest {
  inventory_id: number;
  status: string;
  remarks?: string | null;
  total_amount: number;
  lines: OpeningStockLine[];
}

const baseUrl = `/v1/opening-stocks`;

export const openingStockService = {
  getAll: async (params?: Filters): Promise<OpeningStockResponse> => {
    return await api.get(baseUrl, { params });
  },

  getById: async (id: number): Promise<ApiResponse<OpeningStock>> => {
    return await api.get(`${baseUrl}/${id}`);
  },

  create: async (
    data: OpeningStockRequest,
  ): Promise<ApiResponse<OpeningStock>> => {
    return await api.post(baseUrl, data);
  },

  update: async (
    id: number,
    data: OpeningStockRequest,
  ): Promise<ApiResponse<OpeningStock>> => {
    return await api.put(`${baseUrl}/${id}`, data);
  },

  confirm: async (id: number): Promise<ApiResponse<{ data: boolean }>> => {
    return await api.patch(`${baseUrl}/${id}/confirm`);
  },
};
