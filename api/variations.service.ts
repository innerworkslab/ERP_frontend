import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters } from "@/types/api.type";

export interface Variation {
  id: number;
  name: string;
  value_data_type: "Number" | "String" | "Boolean" | "Date";
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface VariationListResponse {
  response: { status: string; message: string };
  data: Variation[];
  meta: { total_pages: number; current_page: number; total: number };
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.VARIATION}`;

export const variationService = {
  getAll: (params?: Filters): Promise<VariationListResponse> =>
    api.get(`${baseUrl}/${API_CONSTANT.ALL}`, { params }),

  getById: (id: string | number): Promise<{ data: Variation }> =>
    api.get(`${baseUrl}/${id}`),

  create: (payload: Partial<Variation>) => api.post(baseUrl, payload),

  update: (id: number, payload: Partial<Variation>) =>
    api.put(`${baseUrl}/${id}`, payload),

  toggleStatus: (id: number) => api.patch(`${baseUrl}/${id}/toggle-status`),
};
