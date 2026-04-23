import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { Filters } from "@/types/api.type";

export type DiscountGroupFilters = Filters & {
  status?: string | undefined;
  search?: string;
  branch_id?: number;
  customer_type_id?: number;
};

export interface DiscountGroup {
  id: number;
  name: string;
  customer_type_id: number;
  branch_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  customer_type?: { id: number; name: string };
  branch?: { id: number; name: string; prefix: string };
}

export interface DiscountGroupListResponse {
  response: {
    status: string;
    message: string;
  };
  data: DiscountGroup[];
  meta: { total_pages: number; current_page: number; total: number };
}

const baseUrl = `/v1/${API_CONSTANT.DISCOUNT_GROUP}`;

export const discountGroupService = {
  getAll: (params?: DiscountGroupFilters): Promise<DiscountGroupListResponse> =>
    api.get(baseUrl, { params }),

  getById: (id: number): Promise<{ data: DiscountGroup }> =>
    api.get(`${baseUrl}/${id}`),

  create: (payload: DiscountGroupFilters) => api.post(baseUrl, payload),

  update: (id: number, payload: DiscountGroupFilters) =>
    api.put(`${baseUrl}/${id}`, payload),

  toggleStatus: (id: number) => api.patch(`${baseUrl}/${id}/toggle-status`),
};
