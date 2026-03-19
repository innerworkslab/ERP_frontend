import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters, PaginationMeta } from "@/types/api.type";
import { User } from "./auth.service";

export type BranchesFilter = Filters & {
  status?: string;
};

export interface Branch {
  id: number;
  prefix: string;
  name: string;
  location: string;
  status: "active" | "inactive";
  created_by: User;
  updated_by: User;
  created_at: string;
  updated_at: string;
}

export interface BranchesListResponse {
  data: Branch[];
  meta?: PaginationMeta;
}

export interface CreateBranchRequest {
  prefix: string;
  name: string;
  location: string;
  status: "active" | "inactive";
}

export type UpdateBranchRequest = CreateBranchRequest;

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.BRANCH}`;

export const branchService = {
  getAll: async (params?: BranchesFilter): Promise<BranchesListResponse> => {
    const res = (await api.get(`${baseUrl}/${API_CONSTANT.ALL}`, {
      params,
    })) as unknown as BranchesListResponse;
    return res;
  },

  getById: async (id: number): Promise<ApiResponse<Branch>> => {
    return await api.get(`${baseUrl}/${id}`);
  },

  create: async (
    payload: CreateBranchRequest,
  ): Promise<ApiResponse<Branch>> => {
    return await api.post(baseUrl, payload);
  },

  update: async (
    id: number,
    payload: UpdateBranchRequest,
  ): Promise<ApiResponse<Branch>> => {
    return await api.put(`${baseUrl}/${id}`, payload);
  },

  toggle: async (id: number): Promise<ApiResponse<Branch>> => {
    return await api.patch(`${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`);
  },
};
