import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters } from "@/types/api.type";

export type ProductFilters = Filters & {
  status?: string;
  search?: string;
};

export interface Product {
  id: number;
  name: string;
  sku: string;
  image_url: string;
  category_id: number;
  brand_id: number;
  alert_quantity: string | number;
  purchase_price: string | number;
  purchase_currency_id: number;
  purchase_tax_id: number;
  purchase_uom_id: number;
  sale_price: string | number;
  sale_currency_id: number;
  sale_tax_id: number;
  sale_uom_id: number;
  sale_currency?: { symbol: string };
  origin_country_id: number;
  status: "active" | "inactive";
  category?: { name: string };
  brand?: { name: string };
}

export interface ProductListResponse {
  response: { status: string; message: string };
  data: Product[];
  meta?: { total_pages: number };
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.PRODUCT}`;

export const productService = {
  getAll: async (params?: ProductFilters): Promise<ProductListResponse> =>
    await api.get(baseUrl, { params }),

  getById: async (id: number): Promise<ApiResponse<Product>> =>
    await api.get(`${baseUrl}/${id}`),

  create: async (payload: FormData) =>
    await api.post(baseUrl, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: async (id: number, payload: FormData) => {
    return await api.post(`${baseUrl}/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  toggle: async (id: number): Promise<ApiResponse<Product>> =>
    await api.patch(`${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`),
};
