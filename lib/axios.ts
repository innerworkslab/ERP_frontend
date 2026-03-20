import axios from "axios";
import { getDecryptedCookie } from "./cookie.utils";
import { COOKIES } from "@/constants/cookie.constant";
import { LoginResponse } from "@/api/auth.service";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const authData = getDecryptedCookie(
      COOKIES.AUTH_USER,
    ) as LoginResponse | null;
    const token = authData?.token?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    const message =
      data?.message ||
      data?.response?.message ||
      "An unexpected error occurred";

    if (status === 401) {
      toast.error("Session expired. Please login again.");
      window.location.href = "/";
    } else {
      toast.error(message, {
        description: data?.errors
          ? Object.values(data.errors).flat().join(", ")
          : undefined,
      });
    }

    return Promise.reject(data || error);
  },
);
