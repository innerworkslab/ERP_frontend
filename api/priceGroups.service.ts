import { api } from "@/lib/axios";
import { ApiResponse, Filters } from "@/types/api.type";
import { Branch } from "./branches.service";
import { Customer } from "./customers.service";
import { API_CONSTANT } from "@/constants/api.constant";

export interface PriceGroup {
  id: number;
  name: string;
  customer_type_id: number;
  branch_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  customer_type?: Customer;
  branch?: Branch;
}

export interface PriceGroupFilters extends Filters {
  search?: string;
  branch_id?: number | string;
  customer_type_id?: number | string;
}

export interface PriceGroupListResponse {
  response: {
    status: string;
    message: string;
  };
  data: PriceGroup[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.PRICE_GROUP}`;

export const priceGroupService = {
  getAll: async (
    params?: PriceGroupFilters,
  ): Promise<PriceGroupListResponse> => {
    return await api.get(baseUrl, { params });
  },
  getById: async (id: number): Promise<ApiResponse<PriceGroup>> => {
    return await api.get(`${baseUrl}/${id}`);
  },
  create: async (
    payload: Partial<PriceGroup>,
  ): Promise<ApiResponse<PriceGroup>> => {
    return await api.post(baseUrl, payload);
  },
  update: async (
    id: number,
    payload: Partial<PriceGroup>,
  ): Promise<ApiResponse<PriceGroup>> => {
    return await api.put(`${baseUrl}/${id}`, payload);
  },
  toggle: async (id: number): Promise<ApiResponse<PriceGroup>> => {
    return await api.patch(`${baseUrl}/${id}/toggle-status`);
  },
};
