import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters, PaginationMeta } from "@/types/api.type";
import { Cashbook } from "./cashbooks.service";

export type SaleInvoicesFilters = Filters & {
  status?: string;
  payment_status?: string;
  branch_id?: number;
  inventory_id?: number;
  customer_id?: number;
};

export interface SaleInvoiceListItem {
  id: number;
  invoice_number: string;
  invoice_date: string;
  branch_id: number;
  inventory_id: number;
  customer_id: number;
  currency_id: number;
  exchange_rate: string;
  selling_price_group_id: number;
  payment_terms: string;
  payment_due_date: string;
  payment_status: string;
  status: string;
  inventory_transaction_method: string;
  remarks: string | null;
  sell_tax_id: number;
  sub_total: string;
  items_discount: string;
  invoice_discount_type: string;
  invoice_discount_amount: string;
  tax_total: string;
  delivery_charge: string;
  grand_total: string;
  paid_amount: string;
  cashbook_id: number | null;
  created_at: string;
  updated_at: string;
  branch?: {
    id: number;
    prefix: string;
    name: string;
    address: string;
    mobile_phones: string[];
    email: string;
    status: string;
  };
  inventory?: {
    id: number;
    name: string;
  };
  customer?: {
    id: number;
    code: string;
    name: string;
    company_name: string;
    phone_number: string;
    status: string;
  };
  currency?: {
    id: number;
    name: string;
    code: string;
    symbol: string;
  };
  selling_price_group?: {
    id: number;
    name: string;
    status: string;
  };
  sell_tax?: {
    id: number;
    category: string;
    code: string;
    amount: string;
  };
  cashbook?: Cashbook | null;
  delivery?: {
    id: number;
    sale_invoice_id: number;
    delivery_provider_id: number;
    delivery_charge_paid: string;
    delivery_charge: string;
    receiver_name: string;
    receiver_phone: string;
    receiver_address: string;
    receiver_note: string;
    delivery_provider?: {
      id: number;
      name: string;
      default_price: string;
      status: string;
    };
  };
}

export interface SaleInvoiceDetail extends SaleInvoiceListItem {
  items: Array<{
    id: number;
    sale_invoice_id: number;
    product_id: number;
    uom_id: number;
    quantity: string;
    unit_price: string;
    discount_type: string;
    discount: string;
    tax: string;
    total: string;
    remarks: string | null;
    created_at: string;
    updated_at: string;
    product?: {
      id: number;
      name: string;
      sku: string;
      sale_price: string;
      status: string;
    };
    uom?: {
      id: number;
      name: string;
      code: string;
    };
  }>;
}

export interface SaleInvoicesListResponse {
  data: SaleInvoiceListItem[];
  meta?: PaginationMeta;
}

export interface SaleInvoiceItemPayload {
  product_id: number;
  uom_id: number;
  quantity: number;
  unit_price: number;
  discount_type: string;
  discount_amount: number;
  remarks?: string | null;
}

export interface SaleInvoiceDeliveryPayload {
  delivery_provider_id: number;
  delivery_charge_paid: string;
  delivery_charge: number;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  receiver_note?: string | null;
}

export interface CreateSaleInvoiceRequest {
  branch_id: number;
  inventory_id: number;
  customer_id: number;
  currency_id: number;
  selling_price_group_id: number;
  inventory_transaction_method: string;
  invoice_date: string;
  payment_terms: string;
  payment_due_date: string;
  status: string;
  remarks?: string | null;
  sell_tax_id: number;
  invoice_discount_type: string;
  invoice_discount_amount: number;
  paid_amount: number;
  cashbook_id?: number | null;
  items: SaleInvoiceItemPayload[];
  delivery: SaleInvoiceDeliveryPayload;
}

export type UpdateSaleInvoiceRequest = Partial<CreateSaleInvoiceRequest>;

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.SALE_INVOICE || "sale-invoices"}`;

export const saleInvoicesService = {
  getAll: async (
    params?: SaleInvoicesFilters,
  ): Promise<SaleInvoicesListResponse> => {
    return await api.get(`${baseUrl}`, { params });
  },

  getById: async (id: number): Promise<ApiResponse<SaleInvoiceDetail>> => {
    return await api.get(`${baseUrl}/${id}`);
  },

  create: async (
    payload: CreateSaleInvoiceRequest,
  ): Promise<ApiResponse<SaleInvoiceDetail>> => {
    return await api.post(baseUrl, payload);
  },

  update: async (
    id: number,
    payload: UpdateSaleInvoiceRequest,
  ): Promise<ApiResponse<SaleInvoiceDetail>> => {
    return await api.put(`${baseUrl}/${id}`, payload);
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await api.delete(`${baseUrl}/${id}`);
  },

  markAsReserved: async (
    id: number,
  ): Promise<ApiResponse<SaleInvoiceDetail>> => {
    return await api.patch(`${baseUrl}/${id}/reserved`);
  },

  markAsPending: async (
    id: number,
  ): Promise<ApiResponse<SaleInvoiceDetail>> => {
    return await api.patch(`${baseUrl}/${id}/pending`);
  },

  markAsOrdered: async (
    id: number,
  ): Promise<ApiResponse<SaleInvoiceDetail>> => {
    return await api.patch(`${baseUrl}/${id}/ordered`);
  },
};
