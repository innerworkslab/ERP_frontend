import { ApiResponse } from "./../types/api.type";
import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { Filters } from "@/types/api.type";

export type StockBalanceFilters = Filters & {
  search?: string;
};

export interface StockBalance {
  product_image: string;
  product_name: string;
  sku: string;
  barcode: string | null;
  category_name: string;
  brand_name: string;
  branch_names: string;
  inventory_name: string;
  stock_uom: string;
  on_hand_quantity: string;
  reserved_quantity: number;
  available_quantity: string;
  reorder_level: string;
  unit_cost: string;
  total_stock_value: string;
  lot_no: string | null;
  expired_date: string | null;
  serial_no: string | null;
  last_movement_date: string;
  status: string;
}

export interface StockBalanceListResponse {
  response: {
    status: string;
    message: string;
  };
  data: StockBalance[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

export interface ProductLot {
  product_id: number;
  inventory_id: number;
  lot_no: string;
  expired_date: string;
  serial_no: string;
  total_qty: number;
  expired_qty: number;
  nearly_expired_qty: number;
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.STOCK_BALANCE}`;

export const stockBalanceService = {
  getBalanceList: async (
    params?: StockBalanceFilters,
  ): Promise<StockBalanceListResponse> => {
    return await api.get(baseUrl, { params });
  },
  getBalanceById: async (id: number): Promise<ApiResponse<StockBalance>> => {
    return await api.get(`${baseUrl}/${id}`);
  },
  getProductLots: async (
    productId: number,
  ): Promise<ApiResponse<ProductLot[]>> => {
    return await api.get(`${baseUrl}/product/${productId}/lots`);
  },
};
