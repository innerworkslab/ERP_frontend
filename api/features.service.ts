/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";
import { Role } from "./roles.service";
import { API_CONSTANT } from "@/constants/api.constant";
import { ApiResponse, Filters } from "@/types/api.type";

export type FeatureFilters = Filters & {
  status?: string | undefined;
  search?: string;
  branch_id?: number;
  department_id?: number;
  role_id?: number;
};

export interface Permission {
  id: number;
  feature_id: number;
  name: string;
  key: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Feature {
  id: number;
  name: string;
  key: string;
  module: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  roles?: Role[];
  permissions?: Permission[];
}

export interface FeatureListResponse {
  response: {
    status: string;
    message: string;
  };
  data: Feature[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

export interface SingleFeatureResponse {
  response: {
    status: string;
    message: string;
  };
  data: Feature;
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.FEATURE}`;

export const featureService = {
  getAll: async (params?: FeatureFilters): Promise<FeatureListResponse> => {
    return await api.get(`${baseUrl}/${API_CONSTANT.ALL}`, { params });
  },

  getById: async (id: number): Promise<SingleFeatureResponse> => {
    return await api.get(`${baseUrl}/${id}`);
  },

  assignRoles: async (payload: {
    feature_id: number;
    role_ids: number[];
  }): Promise<any> => {
    return await api.post(`${baseUrl}/${API_CONSTANT.ASSIGN_ROLES}`, payload);
  },

  toggle: async (id: number): Promise<ApiResponse<Feature>> => {
    return await api.patch(`${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`);
  },
};
