import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters } from "@/types/api.type";

export type BranchFilters = Filters & {
  status?: string;
  search?: string;
};

export interface Branch {
  id: number;
  prefix: string;
  name: string;
  latitude?: string;
  longitude?: string;
  mobile?: string;
  alternate_phone?: string;
  email?: string;
  website?: string;
  state_id: number;
  city_id: number;
  default_selling_price_group_id: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface BranchesListResponse {
  response: { status: string; message: string };
  data: Branch[];
  meta?: { total_pages: number };
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.BRANCH}`;

export const branchService = {
  getAll: async (params?: BranchFilters): Promise<BranchesListResponse> => {
    return await api.get(`${baseUrl}/${API_CONSTANT.ALL}`, { params });
  },
  create: async (payload: Partial<Branch>): Promise<ApiResponse<Branch>> => {
    return await api.post(baseUrl, payload);
  },
  update: async (
    id: number,
    payload: Partial<Branch>,
  ): Promise<ApiResponse<Branch>> => {
    return await api.put(`${baseUrl}/${id}`, payload);
  },
  toggle: async (id: number): Promise<ApiResponse<Branch>> => {
    return await api.patch(`${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`);
  },
};
