import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters, PaginationMeta } from "@/types/api.type";
import { User } from "./auth.service";

export type SuppliersFilter = Filters & {
  status?: string;
};

export interface Supplier {
  id?: number;
  name: string;
  company_name: string;
  phone_number: string;
  country: string;
  town: string;
  township: string;
  address: string;
  bank_acc?: string | null;
  branch_id: number;
  credit_limit: number;
  opening: number;
  type: string;
  birthday?: string | null;
  payment_terms?: string | null;
  payment_due?: string | null;
  status: "active" | "inactive";
  branch?: {
    id: number;
    prefix: string;
    name: string;
    location: string;
  };
  created_by?: User;
  updated_by?: User;
  created_at?: string;
  updated_at?: string;
  supplier_type_id: number;
  supplier_type?: {
    id: number;
    name: string;
  };
  state_id?: number;
  city_id?: number;
  bank_accounts?: {
    bank_name: string;
    account_number: string;
    holder_name: string;
  }[];
}

export interface SuppliersListResponse {
  data: Supplier[];
  meta?: PaginationMeta;
}

export interface CreateSupplierRequest {
  name: string;
  company_name: string;
  phone_number: string;
  country: string;
  town: string;
  township: string;
  address: string;
  bank_acc: string;
  branch_id: number;
  credit_limit: number;
  opening: number;
  type: string;
  birthday: string;
  payment_terms: string;
  payment_due: string;
  status: string;
  supplier_type_id: number;
}

export type UpdateSupplierRequest = CreateSupplierRequest;

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.SUPPLIER}`;

export const supplierService = {
  getAll: async (params?: SuppliersFilter): Promise<SuppliersListResponse> => {
    const res = (await api.get(`${baseUrl}`, {
      params,
    })) as unknown as SuppliersListResponse;
    return res;
  },

  getById: async (id: number): Promise<ApiResponse<Supplier>> => {
    return await api.get(`${baseUrl}/${id}`);
  },

  create: async (
    payload: CreateSupplierRequest,
  ): Promise<ApiResponse<Supplier>> => {
    return await api.post(baseUrl, payload);
  },

  update: async (
    id: number,
    payload: UpdateSupplierRequest,
  ): Promise<ApiResponse<Supplier>> => {
    return await api.put(`${baseUrl}/${id}`, payload);
  },

  toggle: async (id: number): Promise<ApiResponse<Supplier>> => {
    return await api.patch(`${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`);
  },
};
