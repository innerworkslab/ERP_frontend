import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters, PaginationMeta } from "@/types/api.type";
import { User } from "./auth.service";

export type CustomersFilter = Filters & {
  status?: string;
};

export interface Customer {
  id: number;
  code: string;
  name: string;
  company_name: string;
  phone_number: string;
  country: string;
  town: string;
  township: string;
  address: string;
  bank_acc: string;
  branch_id: number;
  credit_limit: string;
  opening: string;
  type: string;
  birthday: string;
  payment_terms: string;
  payment_due: string;
  status: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  branch?: {
    id: number;
    prefix: string;
    name: string;
    location: string;
  };
}

export interface CustomersListResponse {
  data: Customer[];
  meta?: PaginationMeta;
}

export interface CreateCustomerRequest {
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
}

export type UpdateCustomerRequest = CreateCustomerRequest;

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.CUSTOMER}`;

export const customerService = {
  getAll: async (params?: CustomersFilter): Promise<CustomersListResponse> => {
    const res = (await api.get(`${baseUrl}`, {
      params,
    })) as unknown as CustomersListResponse;
    return res;
  },

  getById: async (id: number): Promise<ApiResponse<Customer>> => {
    return await api.get(`${baseUrl}/${id}`);
  },

  create: async (
    payload: CreateCustomerRequest,
  ): Promise<ApiResponse<Customer>> => {
    return await api.post(baseUrl, payload);
  },

  update: async (
    id: number,
    payload: UpdateCustomerRequest,
  ): Promise<ApiResponse<Customer>> => {
    return await api.put(`${baseUrl}/${id}`, payload);
  },

  toggle: async (id: number): Promise<ApiResponse<Customer>> => {
    return await api.patch(`${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`);
  },
};
