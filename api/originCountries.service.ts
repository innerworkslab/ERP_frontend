import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters } from "@/types/api.type";

export type OriginCountryFilters = Filters & {
  search?: string;
};

export interface OriginCountry {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface OriginCountryListResponse {
  response: { status: string; message: string };
  data: OriginCountry[];
  meta?: { total_pages: number };
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.ORIGIN_COUNTRY}`;

export const originCountryService = {
  getAll: async (
    params?: OriginCountryFilters,
  ): Promise<OriginCountryListResponse> => {
    return await api.get(baseUrl, { params });
  },
  getById: async (id: number): Promise<ApiResponse<OriginCountry>> => {
    return await api.get(`${baseUrl}/${id}`);
  },
  create: async (payload: {
    name: string;
  }): Promise<ApiResponse<OriginCountry>> => {
    return await api.post(baseUrl, payload);
  },
  update: async (
    id: number,
    payload: { name: string },
  ): Promise<ApiResponse<OriginCountry>> => {
    return await api.put(`${baseUrl}/${id}`, payload);
  },
  toggle: async (id: number): Promise<ApiResponse<OriginCountry>> => {
    return await api.patch(`${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`);
  },
};
