import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { Filters } from "@/types/api.type";

export type CityFilters = Filters & {
  search?: string;
  state_id?: number | string;
};

export interface City {
  id: number;
  state_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CityListResponse {
  response: {
    status: string;
    message: string;
  };
  data: City[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.CITY || "cities"}`;

export const cityService = {
  getAll: async (params?: CityFilters): Promise<CityListResponse> => {
    return await api.get(`${baseUrl}/${API_CONSTANT.ALL_BY_STATE}`, { params });
  },
};
