import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters, PaginationMeta } from "@/types/api.type";
import { User } from "./auth.service";

export type DepartmentsFilters = Filters & {
  status?: string;
  branch_id?: number;
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
  branch_id: number | undefined;
  status: "active" | "inactive";
  created_by: User;
  updated_by: User;
  created_at: string;
  updated_at: string;
}

export interface DepartmentsListResponse {
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
    params?: DepartmentsFilters,
  ): Promise<DepartmentsListResponse> => {
    return await api.get(`${baseUrl}/${API_CONSTANT.ALL}`, { params });
  },

  getById: async (id: number): Promise<ApiResponse<Department>> => {
    return await api.get(`${baseUrl}/${id}`);
  },

  getByBranch: async (
    params?: DepartmentsFilters,
  ): Promise<DepartmentsListResponse> => {
    const res = (await api.get(`${baseUrl}/${API_CONSTANT.BY_BRANCH}`, {
      params,
    })) as unknown as DepartmentsListResponse;
    return res;
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
