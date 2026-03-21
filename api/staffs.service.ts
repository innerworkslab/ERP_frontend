import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters, PaginationMeta } from "@/types/api.type";
import { Department } from "./departments.service";
import { Branch } from "./branches.service";
import { Role } from "./role.service";

export type StaffsFilter = Filters & {
  status?: string;
};

export interface Staff {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone_number: string;

  role_id: number;
  branch_id: number;
  department_id: number;

  status: "active" | "inactive";

  created_at: string;
  updated_at: string;

  role: Role;
  branch: Branch;
  department: Department;

  staff_personal_information: StaffPersonalInformation;
  staff_employment_information: StaffEmploymentInformation;
  staff_banking_information: StaffBankingInformation;
}

export interface StaffPersonalInformation {
  id: number;
  user_id: number;

  date_of_birth: string;

  nrc_number: string;
  nrc_image: string;
  nrc_image_path: string;
  nrc_image_url: string;

  father_name: string;
  mother_name: string;

  town: string;
  township: string;
  address: string;

  house_hold_information_image: string;
  house_hold_information_image_path: string;
  house_hold_information_image_url: string;

  created_at: string;
  updated_at: string;
}

export interface StaffEmploymentInformation {
  id: number;
  user_id: number;

  join_date: string;
  is_contract: boolean;
  off_day: string;

  overtime_fee_type: string;

  salary: string;
  sale_incentive_amount: string;
  sale_commission: string;

  created_at: string;
  updated_at: string;
}

export interface StaffBankingInformation {
  id: number;
  user_id: number;

  bank_name: string;
  account_number: string;

  created_at: string;
  updated_at: string;
}

export interface StaffsListResponse {
  data: Staff[];
  meta?: PaginationMeta;
}

export interface StaffsListResponse {
  data: Staff[];
  meta?: PaginationMeta;
}

export interface CreateStaffRequest {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  role_id: number;
  branch_id: number;
  department_id: number;
  status: string;
  personal_information: {
    date_of_birth: string;
    nrc_number: string;
    father_name: string;
    mother_name: string;
    town: string;
    township: string;
    address: string;
    nrc_image: FileList;
    house_hold_information_image: FileList;
  };
  employment_information: {
    join_date: string;
    is_contract: number;
    off_day: string;
    overtime_fee_type: string;
    salary: number;
    sale_incentive_amount: number;
    sale_commission: number;
  };
  banking_information: {
    bank_name: string;
    account_number: string;
  };
}

export type UpdateStaffRequest = CreateStaffRequest;

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.STAFF}`;

export const staffService = {
  getAll: async (params?: StaffsFilter): Promise<StaffsListResponse> => {
    const res = (await api.get(`${baseUrl}`, {
      params,
    })) as unknown as StaffsListResponse;
    return res;
  },

  getById: async (id: number): Promise<ApiResponse<Staff>> => {
    return await api.get(`${baseUrl}/${id}`);
  },

  create: async (
    payload: CreateStaffRequest | FormData,
  ): Promise<ApiResponse<Staff>> => {
    return await api.post(baseUrl, payload);
  },

  update: async (
    id: number,
    payload: UpdateStaffRequest | FormData,
  ): Promise<ApiResponse<Staff>> => {
    return await api.put(`${baseUrl}/${id}`, payload);
  },

  toggle: async (id: number): Promise<ApiResponse<Staff>> => {
    return await api.patch(`${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`);
  },
};
