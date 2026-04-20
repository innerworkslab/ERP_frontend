import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { Filters } from "@/types/api.type";
import { UOM } from "./uom.service";

export interface UOMConversion {
  id: number;
  base_unit_id: number;
  conversion_unit_id: number;
  conversion_rate: string | number;
  base_unit: UOM;
  conversion_unit: UOM;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  created_by?: { name: string };
  updated_by?: { name: string };
}

export interface UOMConversionListResponse {
  response: { status: string; message: string };
  data: UOMConversion[];
  meta: {
    total_pages: number;
    current_page: number;
    total: number;
  };
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.UOM_CONVERSION}`;

export const uomConversionService = {
  getAll: (params?: Filters): Promise<UOMConversionListResponse> =>
    api.get(`${baseUrl}/${API_CONSTANT.ALL}`, { params }),

  getById: (id: string | number): Promise<{ data: UOMConversion }> =>
    api.get(`${baseUrl}/${id}`),

  create: (payload: Partial<UOMConversion>) => api.post(baseUrl, payload),

  update: (id: number, payload: Partial<UOMConversion>) =>
    api.put(`${baseUrl}/${id}`, payload),

  toggleStatus: (id: number) => api.patch(`${baseUrl}/${id}/toggle-status`),
};
