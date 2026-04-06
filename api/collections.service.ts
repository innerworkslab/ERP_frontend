import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters, PaginationMeta } from "@/types/api.type";
import { Currency } from "./currencies.service";
import { Tax } from "./taxes.service";
import { UOM } from "./uom.service";

export type CollectionFilters = Filters & {
  status?: string;
};

export interface Collection {
  id: number;
  name: string;
  purchase_price: number;
  purchase_currency_id: number;
  purchase_tax_id: number;
  purchase_uom_id: number;
  sale_price: number;
  sale_currency_id: number;
  sale_tax_id: number;
  sale_uom_id: number;
  status: string;
  product_count?: number;
  created_at: string;
  updated_at: string;
  purchase_currency?: { symbol: string; code: string };
  sale_currency?: { symbol: string; code: string };
}

export interface CollectionRequest {
  name: string;
  purchase_price: number;
  purchase_currency_id: number;
  purchase_tax_id: number;
  purchase_uom_id: number;
  sale_price: number;
  sale_currency_id: number;
  sale_tax_id: number;
  sale_uom_id: number;
  status: string;
}

export interface CollectionProductPivot {
  collection_id: number;
  product_id: number;
  id: number;
  product_qty: string;
  created_at: string;
  updated_at: string;
}

export interface CollectionProduct {
  id: number;
  name: string;
  sku: string;
  image: string;
  image_path: string;
  image_url: string;
  category_id: number;
  brand_id: number;
  alert_quantity: string;
  purchase_price: string;
  purchase_currency_id: number;
  purchase_tax_id: number;
  purchase_uom_id: number;
  sale_price: string;
  sale_currency_id: number;
  sale_tax_id: number;
  sale_uom_id: number;
  origin_country_id: number;
  created_by: number;
  updated_by: number | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  pivot: CollectionProductPivot;
  category: {
    id: number;
    name: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  brand: {
    id: number;
    name: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  origin_country: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  purchase_currency: Currency;
  sale_currency: Currency;
  purchase_tax: Tax;
  sale_tax: Tax;
  purchase_uom: UOM;
  sale_uom: UOM;
}

export interface CollectionsListResponse {
  data: Collection[];
  meta?: PaginationMeta;
}

export interface AddProductsRequest {
  products: {
    product_id: number;
    product_qty: number;
  }[];
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.COLLECTION}`;

export const collectionsService = {
  getAll: async (
    params?: CollectionFilters,
  ): Promise<CollectionsListResponse> => {
    const res = (await api.get(`${baseUrl}`, {
      params,
    })) as unknown as CollectionsListResponse;
    return res;
  },

  getById: async (id: number): Promise<ApiResponse<Collection>> => {
    return await api.get(`${baseUrl}/${id}`);
  },

  getProductList: async (
    id: number,
  ): Promise<ApiResponse<CollectionProduct[]>> => {
    return (await api.get(
      `${baseUrl}/${id}/products`,
    )) as unknown as ApiResponse<CollectionProduct[]>;
  },

  create: async (data: CollectionRequest): Promise<ApiResponse<Collection>> => {
    return await api.post(baseUrl, data);
  },

  update: async (
    id: number,
    data: Partial<CollectionRequest>,
  ): Promise<ApiResponse<Collection>> => {
    return await api.post(`${baseUrl}/${id}`, data);
  },

  addProducts: async (
    id: number,
    data: AddProductsRequest,
  ): Promise<ApiResponse<Collection>> => {
    return await api.post(`${baseUrl}/${id}/products`, data);
  },

  toggle: async (id: number): Promise<ApiResponse<Collection>> => {
    return await api.patch(`${baseUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`);
  },
};
