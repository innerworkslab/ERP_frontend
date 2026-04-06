import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { Filters } from "@/types/api.type";

export type InventoryFilters = Filters;

export interface Branch {
  id: number;
  name: string;
  prefix: string;
  pivot?: {
    status: "active" | "inactive";
  };
}

export interface Inventory {
  id: number;
  name: string;
  branches: Branch[];
  created_at: string;
  updated_at: string;
}

export interface InventoryListResponse {
  response: {
    status: string;
    message: string;
  };
  data: Inventory[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.INVENTORY}`;

export const inventoryService = {
  getAll: async (
    params?: InventoryFilters ,
  ): Promise<InventoryListResponse> => await api.get(baseUrl, { params }),

  getById: async (id: number): Promise<Inventory> =>
    await api.get(`${baseUrl}/${id}`),

  create: async (payload: { name: string; branch_ids: number[] }) =>
    await api.post(baseUrl, payload),

  update: async (id: number, payload: { name: string; branch_ids: number[] }) =>
    await api.put(`${baseUrl}/${id}`, payload),

  toggle: async (id: number) =>
    await api.patch(`${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`),
};
