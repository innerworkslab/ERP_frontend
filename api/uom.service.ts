import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";

export interface UOM {
  id: number;
  name: string;
  code: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  created_by?: { name: string; email: string };
  updated_by?: { name: string; email: string };
}

export type UOMListResponse = UOM[];

const version = "v1";
const baseUrl = `${version}/${API_CONSTANT.UOM}`;

export const uomService = {
  getAll: async (params?: { search?: string; page?: number }) => {
    const res = await api.get<UOMListResponse>(
      `${baseUrl}/${API_CONSTANT.ALL}`,
      { params },
    );
    return res.data;
  },
  getById: async (id: string | number) => {
    const res = await api.get<{ data: UOM }>(`${baseUrl}/${id}`);
    return res.data;
  },
  create: async (payload: Omit<UOM, "id" | "created_at" | "updated_at">) => {
    const res = await api.post(baseUrl, payload);
    return res.data;
  },
  update: async (id: number, payload: Partial<UOM>) => {
    const res = await api.put(`${baseUrl}/${id}`, payload);
    return res.data;
  },
  toggleStatus: async (id: number) => {
    const res = await api.patch(
      `${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`,
    );
    return res.data;
  },
};
