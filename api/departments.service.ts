import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters, PaginationMeta } from "@/types/api.type";
import { User } from "./auth.service";

export type DepartmentesFilter = Filters & {
  status?: string;
};

export interface Department {
  id: number;
  code: string;
  name: string;
  branch: {
    id: number;
    prefix: string;
    name: string;
    location: string;
  };
  status: "active" | "inactive";
  created_by: User;
  updated_by: User;
  created_at: string;
  updated_at: string;
}

export interface DepartmentesListResponse {
  data: Department[];
  meta?: PaginationMeta;
}

export interface CreateDepartmentRequest {
  code: string;
  name: string;
  branch_id: number;
  status: "active" | "inactive";
}

export type UpdateDepartmentRequest = CreateDepartmentRequest;

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.DEPARTMENT}`;

export const departmentService = {
  getAll: async (
    params?: DepartmentesFilter,
  ): Promise<DepartmentesListResponse> => {
    const res = (await api.get(`${baseUrl}/${API_CONSTANT.ALL}`, {
      params,
    })) as unknown as DepartmentesListResponse;
    return res;
  },

  getById: async (id: number): Promise<ApiResponse<Department>> => {
    return await api.get(`${baseUrl}/${id}`);
  },

  create: async (
    payload: CreateDepartmentRequest,
  ): Promise<ApiResponse<Department>> => {
    return await api.post(baseUrl, payload);
  },

  update: async (
    id: number,
    payload: UpdateDepartmentRequest,
  ): Promise<ApiResponse<Department>> => {
    return await api.put(`${baseUrl}/${id}`, payload);
  },

  toggle: async (id: number): Promise<ApiResponse<Department>> => {
    return await api.patch(`${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`);
  },
};
