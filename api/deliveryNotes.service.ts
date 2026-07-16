export interface DeliveryNoteItemPayload {
  sale_invoice_item_id: number;
  product_id: number;
  quantity: number;
  remark?: string;
}

export interface DeliveryNotePayload {
  sale_invoice_id: number;
  source_inventory_id: number;
  delivery_date: string;
  delivery_provider_id: number;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  delivery_note?: string;
  items: DeliveryNoteItemPayload[];
}

import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters } from "@/types/api.type";

export interface DeliveryNoteItem {
  id: number;
  deliver_note_id: number;
  sale_invoice_item_id: number;
  product_id: number;
  uom_id: number;
  quantity: string;
  unit_price: string;
  total_price: string;
  remark: string;
}

export interface DeliveryNote {
  id: number;
  deliver_note_no: string;
  sale_invoice_id: number;
  delivery_date: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  delivery_note: string;
  status: string;
  items: DeliveryNoteItem[];
}

export interface DeliveryNoteListResponse {
  response: { status: string; message: string };
  data: DeliveryNote[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.DELIVERY_NOTES}`;

export const deliveryNoteService = {
  getAll: async (params?: Filters): Promise<DeliveryNoteListResponse> => {
    return await api.get(baseUrl, { params });
  },

  getById: async (id: number): Promise<ApiResponse<DeliveryNote>> => {
    return await api.get(`${baseUrl}/${id}`);
  },

  create: async (
    payload: DeliveryNotePayload,
  ): Promise<ApiResponse<DeliveryNote>> => {
    return await api.post(baseUrl, payload);
  },

  update: async (
    id: number,
    payload: DeliveryNotePayload,
  ): Promise<ApiResponse<DeliveryNote>> => {
    return await api.put(`${baseUrl}/${id}`, payload);
  },

  updateStatus: async (
    id: number,
    status: "pending" | "confirmed" | "rejected",
  ): Promise<ApiResponse<void>> => {
    return await api.patch(`${baseUrl}/${id}/${status}`);
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await api.delete(`${baseUrl}/${id}`);
  },
};
