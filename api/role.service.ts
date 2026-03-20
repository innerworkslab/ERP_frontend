import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters, PaginationMeta } from "@/types/api.type";
import { User } from "./auth.service";

export type RolesFilters = Filters & {
  status?: string;
  branch_id?: number;
  department_id?: number;
};

export interface Role {
  id: number;
  name: string;
  status: "active" | "inactive";
  branch_id: number;
  department_id: number;
  parent_role_id: number | null;
  parent_role: { name: string };
  branch: { name: string };
  department: { name: string };
  created_by?: User;
  updated_by?: User;
  created_at?: string;
  updated_at?: string;
}

export interface RolesListResponse {
  data: Role[];
  meta?: PaginationMeta;
}

export interface CreateRoleRequest {
  name: string;
  status: "active" | "inactive";
  branch_id: number;
  department_id: number;
  parent_role_id?: number | null;
}

export type UpdateRoleRequest = Partial<CreateRoleRequest>;

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.ROLE}`;

export const rolesService = {
  getAll: async (params?: RolesFilters): Promise<RolesListResponse> => {
    return await api.get(`${baseUrl}/${API_CONSTANT.ALL}`, { params });
  },

  getAllWithoutPagination: async (): Promise<RolesListResponse> => {
    return await api.get(`${baseUrl}/${API_CONSTANT.ALL}`, {
      params: { status: "active", paginate: 0 },
    });
  },

  getById: async (id: number): Promise<ApiResponse<Role>> => {
    return await api.get(`${baseUrl}/${id}`);
  },

  create: async (payload: CreateRoleRequest): Promise<ApiResponse<Role>> => {
    return await api.post(baseUrl, payload);
  },

  update: async (
    id: number,
    payload: UpdateRoleRequest,
  ): Promise<ApiResponse<Role>> => {
    return await api.put(`${baseUrl}/${id}`, payload);
  },

  toggle: async (id: number): Promise<ApiResponse<Role>> => {
    return await api.patch(`${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`);
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await api.delete(`${baseUrl}/${id}`);
  },
};
