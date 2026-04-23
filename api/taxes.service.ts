import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters } from "@/types/api.type";

export type TaxFilters = Filters & {
  status?: string;
  search?: string;
};

export interface Tax {
  id: number;
  category: string;
  code: string;
  type: "sale" | "purchase";
  amount: string | number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface TaxListResponse {
  response: { status: string; message: string };
  data: Tax[];
  meta?: { total_pages: number };
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.TAX}`;

export const taxService = {
  getAll: async (params?: TaxFilters): Promise<TaxListResponse> => {
    return await api.get(baseUrl, { params });
  },
  getById: async (id: number): Promise<ApiResponse<Tax>> => {
    return await api.get(`${baseUrl}/${id}`);
  },
  create: async (payload: Partial<Tax>): Promise<ApiResponse<Tax>> => {
    return await api.post(baseUrl, payload);
  },
  update: async (
    id: number,
    payload: Partial<Tax>,
  ): Promise<ApiResponse<Tax>> => {
    return await api.put(`${baseUrl}/${id}`, payload);
  },
  toggle: async (id: number): Promise<ApiResponse<Tax>> => {
    return await api.patch(`${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`);
  },
};
