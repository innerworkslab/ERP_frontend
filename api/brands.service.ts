import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters } from "@/types/api.type";

export type BrandFilters = Filters & {
  status?: string;
  search?: string;
};

export interface Brand {
  id: number;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BrandListResponse {
  response: { status: string; message: string };
  data: Brand[];
  meta?: { total_pages: number };
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.BRAND}`;

export const brandService = {
  getAll: async (params?: BrandFilters): Promise<BrandListResponse> => {
    return await api.get(baseUrl, { params });
  },
  create: async (payload: { name: string }): Promise<ApiResponse<Brand>> => {
    return await api.post(baseUrl, payload);
  },
  update: async (
    id: number,
    payload: { name: string },
  ): Promise<ApiResponse<Brand>> => {
    return await api.put(`${baseUrl}/${id}`, payload);
  },
  toggle: async (id: number): Promise<ApiResponse<Brand>> => {
    return await api.patch(`${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`);
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await api.delete(`${baseUrl}/${id}`);
  },
};
