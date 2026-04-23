import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { Filters } from "@/types/api.type";

export type StateFilters = Filters & {
  search?: string;
};

export interface State {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface StateListResponse {
  response: {
    status: string;
    message: string;
  };
  data: State[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.STATE || "states"}`;

export const stateService = {
  getAll: async (params?: StateFilters): Promise<StateListResponse> => {
    return await api.get(`${baseUrl}/${API_CONSTANT.ALL}`, { params });
  },
};
