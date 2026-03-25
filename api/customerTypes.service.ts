import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters } from "@/types/api.type";

export interface CustomerType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerTypeListResponse {
  response: { status: string; message: string };
  data: CustomerType[];
  meta?: { total_pages: number };
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.CUSTOMER_TYPE}`;

export const customerTypeService = {
  getAll: async (params?: Filters): Promise<CustomerTypeListResponse> => {
    return await api.get(baseUrl, { params });
  },
  create: async (payload: {
    name: string;
  }): Promise<ApiResponse<CustomerType>> => {
    return await api.post(baseUrl, payload);
  },
  update: async (
    id: number,
    payload: { name: string },
  ): Promise<ApiResponse<CustomerType>> => {
    return await api.put(`${baseUrl}/${id}`, payload);
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await api.delete(`${baseUrl}/${id}`);
  },
};
