"use client";

import axios from "axios";
import { getDecryptedCookie } from "./cookie.utils";
import { COOKIES } from "@/constants/cookie.constant";
import { LoginResponse } from "@/api/auth.service";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
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
      data?.response?.message ||
      data?.message ||
      "An unexpected error occurred";

    if (status === 401) {
      toast.error("Session expired", {
        description: "Please login again to continue.",
      });

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } else if (status === 422 && data?.errors) {
      const validationErrors = Object.values(data.errors).flat().join(", ");
      console.log("validation ERror", validationErrors);

      toast.error("Validation Error", {
        description: validationErrors,
      });
    } else {
      toast.error(message);
    }

    return Promise.reject(data || error);
  },
);
