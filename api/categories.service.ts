import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters } from "@/types/api.type";

export type CategoryFilters = Filters & {
  status?: string;
  search?: string;
};

export interface Category {
  id: number;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryListResponse {
  response: { status: string; message: string };
  data: Category[];
  meta?: { total_pages: number };
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.CATEGORY}`;

export const categoryService = {
  getAll: async (params?: CategoryFilters): Promise<CategoryListResponse> => {
    return await api.get(baseUrl, { params });
  },
  create: async (payload: { name: string }): Promise<ApiResponse<Category>> => {
    return await api.post(baseUrl, payload);
  },
  update: async (
    id: number,
    payload: { name: string },
  ): Promise<ApiResponse<Category>> => {
    return await api.put(`${baseUrl}/${id}`, payload);
  },
  toggle: async (id: number): Promise<ApiResponse<Category>> => {
    return await api.patch(`${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`);
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await api.delete(`${baseUrl}/${id}`);
  },
};
