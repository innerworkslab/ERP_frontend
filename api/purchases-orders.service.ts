import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters } from "@/types/api.type";
import { User } from "./auth.service";
import { Branch } from "./branches.service";
import { Currency } from "./currencies.service";

export type PurchaseFilters = Filters & {
  status?: string;
  search?: string;
};

export type PurchaseStatus = "pending" | "approved" | "cancelled";
export type PaymentStatus = "unpaid" | "partially_paid" | "paid";
export type DeliveryStatus =
  | "not_delivered"
  | "partially_delivered"
  | "fully_delivered";
export type DiscountType = "fixed" | "percentage";
export type ExpensesType = "none" | "transport" | "other";

export interface SupplierInfo {
  id: number;
  code: string;
  name: string;
  company_name: string;
  phone_number: string;
  state_id: number;
  city_id: number;
  address: string;
  bank_account_id: number;
  credit_limit: string;
  opening: string;
  supplier_type_id: number;
  birthday: string;
  status: string;
}

export interface InventoryInfo {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ProductInfo {
  id: number;
  name: string;
  sku: string;
  image: string;
  image_path: string;
  image_url: string;
  category_id: number;
  brand_id: number;
  alert_quantity: string;
  stock_uom_id: number;
  purchase_price: string;
  sale_price: string;
  status: string;
}

export interface UomInfo {
  id: number;
  name: string;
  code: string;
  status: string;
}

export interface TaxInfo {
  id: number;
  category: string;
  code: string;
  type: string;
  amount: string;
  status: string;
}

export interface PurchaseLine {
  id?: number;
  purchase_order_id?: number;
  product_id: number;
  uom_id: number;
  quantity: number | string;
  unit_price: number | string;
  gross_amount?: string;
  discount_type: DiscountType;
  discount_value: number | string;
  discount_amount: number | string;
  tax_id: number;
  tax_amount: number | string;
  expenses_type: ExpensesType;
  expenses_amount: number | string;
  line_total?: string;
  total_amount?: number;
  created_at?: string;
  updated_at?: string;
  product?: ProductInfo;
  uom?: UomInfo;
  tax?: TaxInfo;
}

export interface PurchaseOrder {
  id: number;
  po_number: string;
  po_date: string;
  supplier_id: number;
  branch_id: number;
  inventory_id: number;
  currency_id: number;
  subtotal_amount: string | number;
  discount_amount: string | number;
  tax_amount: string | number;
  total_amount: string | number;
  paid_amount: string | number;
  status: PurchaseStatus;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  remarks: string | null;
  created_by: User;
  created_at: string;
  updated_at: string;
  supplier?: SupplierInfo;
  branch?: Branch;
  inventory?: InventoryInfo;
  currency?: Currency;
  lines?: PurchaseLine[];
}

export interface CreatePurchasePayload {
  po_date: string;
  supplier_id: number;
  branch_id: number;
  inventory_id: number;
  currency_id: number;
  subtotal_amount: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  remarks?: string;
  lines: Omit<
    PurchaseLine,
    "id" | "purchase_order_id" | "product" | "uom" | "tax"
  >[];
}

export interface UpdatePurchasePaymentPayload {
  cashbook_id: number;
  paid_amount: number;
}

export interface UpdatePurchaseDeliveryPayload {
  delivery_status: DeliveryStatus;
}

export interface PurchaseListResponse {
  response: {
    status: string;
    message: string;
  };
  data: PurchaseOrder[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

export interface PurchaseSingleResponse {
  response: {
    status: string;
    message: string;
  };
  data: PurchaseOrder;
}

const version = "v1";
const endpointToken = API_CONSTANT.PURCHASE_ORDER;
const purchaseUrl = `/${version}/${endpointToken}`;

export const purchaseService = {
  getAll: async (params?: PurchaseFilters): Promise<PurchaseListResponse> => {
    return await api.get(`${purchaseUrl}`, {
      params,
    });
  },

  getById: async (id: number): Promise<PurchaseSingleResponse> => {
    return await api.get(`${purchaseUrl}/${id}`);
  },

  create: async (
    payload: CreatePurchasePayload,
  ): Promise<ApiResponse<PurchaseOrder>> => {
    return await api.post(purchaseUrl, payload);
  },

  update: async (
    id: number,
    payload: Partial<CreatePurchasePayload>,
  ): Promise<ApiResponse<PurchaseOrder>> => {
    return await api.put(`${purchaseUrl}/${id}`, payload);
  },

  updatePaymentStatus: async (
    id: number,
    payload: UpdatePurchasePaymentPayload,
  ): Promise<ApiResponse<PurchaseOrder>> => {
    return await api.put(`${purchaseUrl}/${id}/payment-status`, payload);
  },

  updateDeliveryStatus: async (
    id: number,
    payload: UpdatePurchaseDeliveryPayload,
  ): Promise<ApiResponse<PurchaseOrder>> => {
    return await api.put(`${purchaseUrl}/${id}/delivery-status`, payload);
  },
};
