import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone_number: string;
  role_id: number;
  branch_id: number | null;
  department_id: number | null;
  salary: number | null;
  sale_incentive: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  phone_number: string;
  password: string;
}

export interface RawLoginResponse {
  token_type: string;
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    phone_number: string;
    role_id: number;
    branch_id: number | null;
    department_id: number | null;
    salary: number | null;
    sale_incentive: number | null;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

export interface LoginResponse {
  token: {
    accessToken: string;
    type: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    phone_number: string;
    role_id: number;
    branch_id: number | null;
    department_id: number | null;
    salary: number | null;
    sale_incentive: number | null;
    status: string;
    created_at: string;
    updated_at: string;
  };
}
const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.USER}/${API_CONSTANT.AUTH}`;

export const authService = {
  login: async (data: LoginRequest) => {
    const res = await api.post<RawLoginResponse>(
      `${baseUrl}/${API_CONSTANT.LOGIN}`,
      data,
    );

    return {
      token: {
        accessToken: res.data.accessToken,
        type: res.data.token_type,
      },
      user: res.data.user,
    };
  },
};
