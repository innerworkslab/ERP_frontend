import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api.type";

export interface StockLedger {
  id: number;
  transaction_date: string;
  reference_type: "transfer_in" | "transfer_out" | "opening_stock";
  reference_id: number | null;
  voucher_no: string;
  product_name: string;
  sku: string;
  inventory_name: string;
  branch_name: string;
  movement_type: "in" | "out";
  quantity: string;
  UOM: string;
  unit_cost: string;
  total_cost: string;
  balance_quantity_before: string;
  balance_quantity_after: string;
  balance_cost_before: string;
  balance_cost_after: string;
  created_at: string;
}

export const stockLedgerService = {
  getAll: async (params?: {
    search?: string;
    page?: number;
  }): Promise<ApiResponse<StockLedger[]>> => {
    return await api.get("/v1/stock-ledgers", {
      params,
    });
  },
};
