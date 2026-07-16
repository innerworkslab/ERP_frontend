import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters, PaginationMeta } from "@/types/api.type";
import { User } from "./auth.service";

export type DeliveryProvidersFilters = Filters & {
  status?: string;
};

export interface DeliveryProvider {
  id: number;
  name: string;
  default_price: string;
  status: "active" | "inactive";
  created_by?: User;
  updated_by?: User | null;
  created_at?: string;
  updated_at?: string;
}

export interface DeliveryProvidersListResponse {
  data: DeliveryProvider[];
  meta?: PaginationMeta;
}

export interface CreateDeliveryProviderRequest {
  name: string;
  default_price: number;
}

export type UpdateDeliveryProviderRequest =
  Partial<CreateDeliveryProviderRequest>;

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.DELIVERY_PROVIDER || "delivery-providers"}`;

export const deliveryProvidersService = {
  getAll: async (
    params?: DeliveryProvidersFilters,
  ): Promise<DeliveryProvidersListResponse> => {
    return await api.get(`${baseUrl}`, { params });
  },

  getAllWithoutPagination: async (): Promise<DeliveryProvidersListResponse> => {
    return await api.get(`${baseUrl}`, {
      params: { status: "active", paginate: 0 },
    });
  },

  getById: async (id: number): Promise<ApiResponse<DeliveryProvider>> => {
    return await api.get(`${baseUrl}/${id}`);
  },

  create: async (
    payload: CreateDeliveryProviderRequest,
  ): Promise<ApiResponse<DeliveryProvider>> => {
    return await api.post(baseUrl, payload);
  },

  update: async (
    id: number,
    payload: UpdateDeliveryProviderRequest,
  ): Promise<ApiResponse<DeliveryProvider>> => {
    return await api.put(`${baseUrl}/${id}`, payload);
  },

  toggle: async (id: number): Promise<ApiResponse<DeliveryProvider>> => {
    return await api.patch(`${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`);
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await api.delete(`${baseUrl}/${id}`);
  },
};
