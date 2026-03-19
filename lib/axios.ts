import axios from "axios";
import { getDecryptedCookie } from "./cookie.utils";
import { COOKIES } from "@/constants/cookie.constant";
import { LoginResponse } from "@/api/auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const authData = getDecryptedCookie(
      COOKIES.AUTH_USER,
    ) as LoginResponse | null;
    const tokenType = authData?.token?.type || "Bearer";
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
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || error);
  },
);
