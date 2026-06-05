/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { ApiResponse, Filters } from "@/types/api.type";
import { User } from "./auth.service";
import { Branch } from "./branches.service";
import { Currency } from "./currencies.service";

export type AccountFilters = Filters & {
  status?: string;
  search?: string;
};

export type CashbookType = "cash" | "bank" | "mobile_wallet" | "petty_cash";

export type TransactionType = "in" | "out";

export type TransferStatus = "confirmed" | "rejected" | "pending";

export interface AccountInfo {
  id: number;
  parent_account_id: number;
  code: string;
  name: string;
  type: string;
  division: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Cashbook {
  id: number;
  branch_id: number;
  account_id: number;
  currency_id: number;
  name: string;
  type: CashbookType;
  opening_balance?: string;
  current_balance: string;
  status: "active" | "inactive";
  remark: string | null;
  created_by: User | number;
  updated_by: User | number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  branch: Branch;
  currency: Currency;
  account: AccountInfo;
}

export interface CashbookAttachment {
  id: number;
  cashbook_transaction_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  extension: string;
  attachment_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
  file_url: string;
}

export interface CashbookTransaction {
  id: number;
  cashbook_id: number;
  source_account_id: number;
  destination_account_id: number;
  transaction_type: TransactionType;
  category: string;
  currency_id: number;
  amount: string;
  remark: string | null;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  cashbook: Cashbook;
  currency: Currency;
  attachments: CashbookAttachment[];
}

export interface CashbookTransferItem {
  id: number;
  source_cashbook_id: number;
  destination_cashbook_id: number;
  transfer_datetime: string;
  currency_id: number;
  amount: string;
  base_currency_amount: string;
  reference_no: string;
  remark: string;
  status: TransferStatus;
  created_by: User;
  updated_by: User;
  created_at: string;
  updated_at: string;
  source_cashbook: Cashbook;
  destination_cashbook: Cashbook;
  currency: Currency;
}

export interface CreateCashbookPayload {
  branch_id: number;
  currency_id: number;
  name: string;
  type: CashbookType;
  status: "active" | "inactive";
  remark?: string;
}

export interface CreateCashbookTransactionPayload {
  cashbook_id: number;
  source_account_id: number;
  destination_account_id: number;
  transaction_type: TransactionType;
  category: string;
  currency_id: number;
  amount: number | string;
  remark?: string;
  description?: string;
  attachments?: File[];
}

export interface CreateCashbookTransferPayload {
  source_cashbook_id: number;
  destination_cashbook_id: number;
  amount: number | string;
  currency_id: number;
  remark?: string;
  attachments?: File[];
}

export interface CashbooksListResponse {
  response: {
    status: string;
    message: string;
  };
  data: Cashbook[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

export interface CashbookTransactionsListResponse {
  response: {
    status: string;
    message: string;
  };
  data: CashbookTransaction[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

export interface CashbookTransfersListResponse {
  response: {
    status: string;
    message: string;
  };
  data: CashbookTransferItem[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

export interface CashbookAdjustment {
  id: number;
  branch_id: number;
  reference_no: string;
  cashbook_id: number;
  type: "increase" | "decrease";
  amount: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approved_by: number | null;
  created_by: number;
  cashbook: Cashbook;
  creator: User;
  approver: User | null;
  branch: Branch;
  created_at: string;
  updated_at: string;
}

export interface CreateCashbookAdjustmentPayload {
  cashbook_id: number;
  type: "increase" | "decrease";
  amount: number | string;
  reason: string;
}

export interface CashbookAdjustmentsListResponse {
  response: {
    status: string;
    message: string;
  };
  data: CashbookAdjustment[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

const version = "v1";

const cashbookUrl = `/${version}/${API_CONSTANT.CASHBOOK}`;
const cashbookTransactionUrl = `/${version}/${API_CONSTANT.CASHBOOK_TRANSACTION}`;
const cashbookTransferUrl = `/${version}/${API_CONSTANT.CASHBOOK_TRANSFER}`;
const cashbookAdjustmentUrl = `/${version}/${API_CONSTANT.CASHBOOK_ADJUSTMENT}`;

export const cashbookService = {
  getAll: async (params?: AccountFilters): Promise<CashbooksListResponse> => {
    return await api.get(`${cashbookUrl}/${API_CONSTANT.ALL}`, {
      params,
    });
  },

  create: async (
    payload: CreateCashbookPayload,
  ): Promise<ApiResponse<Cashbook>> => {
    return await api.post(cashbookUrl, payload);
  },

  update: async (
    id: number,
    payload: Partial<CreateCashbookPayload>,
  ): Promise<ApiResponse<Cashbook>> => {
    return await api.put(`${cashbookUrl}/${id}`, payload);
  },

  toggle: async (id: number): Promise<ApiResponse<Cashbook>> => {
    return await api.patch(
      `${cashbookUrl}/${id}/${API_CONSTANT.TOGGLE_STATUS}`,
    );
  },

  getTransactions: async (
    params?: AccountFilters,
  ): Promise<CashbookTransactionsListResponse> => {
    return await api.get(`${cashbookTransactionUrl}/${API_CONSTANT.ALL}`, {
      params,
    });
  },

  getTransactionById: async (
    id: number,
  ): Promise<ApiResponse<CashbookTransaction>> => {
    return await api.get(`${cashbookTransactionUrl}/${id}`);
  },

  createTransaction: async (
    payload: CreateCashbookTransactionPayload,
  ): Promise<ApiResponse<CashbookTransaction>> => {
    const formData = new FormData();

    formData.append("cashbook_id", String(payload.cashbook_id));
    formData.append("source_account_id", String(payload.source_account_id));
    formData.append(
      "destination_account_id",
      String(payload.destination_account_id),
    );
    formData.append("transaction_type", payload.transaction_type);
    formData.append("category", payload.category);
    formData.append("currency_id", String(payload.currency_id));
    formData.append("amount", String(payload.amount));

    if (payload.remark) formData.append("remark", payload.remark);
    if (payload.description)
      formData.append("description", payload.description);

    payload.attachments?.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });

    return await api.post(cashbookTransactionUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateTransaction: async (
    id: number,
    payload: Partial<CreateCashbookTransactionPayload> & {
      existing_attachment?: any[];
    },
  ): Promise<ApiResponse<CashbookTransaction>> => {
    const formData = new FormData();

    if (payload.cashbook_id)
      formData.append("cashbook_id", String(payload.cashbook_id));
    if (payload.source_account_id)
      formData.append("source_account_id", String(payload.source_account_id));
    if (payload.destination_account_id)
      formData.append(
        "destination_account_id",
        String(payload.destination_account_id),
      );
    if (payload.transaction_type)
      formData.append("transaction_type", payload.transaction_type);
    if (payload.category) formData.append("category", payload.category);
    if (payload.currency_id)
      formData.append("currency_id", String(payload.currency_id));
    if (payload.amount) formData.append("amount", String(payload.amount));
    if (payload.remark !== undefined)
      formData.append("remark", payload.remark || "");
    if (payload.description !== undefined)
      formData.append("description", payload.description || "");

    payload.attachments?.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });

    if (payload.existing_attachment && payload.existing_attachment.length > 0) {
      formData.append(
        "existing_attachment",
        JSON.stringify(payload.existing_attachment),
      );
    } else {
      formData.append("existing_attachment", "[]");
    }

    return await api.post(`${cashbookTransactionUrl}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  confirmTransaction: async (
    id: number,
  ): Promise<ApiResponse<CashbookTransferItem>> => {
    return await api.patch(`${cashbookTransactionUrl}/${id}/confirm`);
  },

  getTransfers: async (
    params?: AccountFilters,
  ): Promise<CashbookTransfersListResponse> => {
    return await api.get(cashbookTransferUrl, {
      params,
    });
  },

  getTransferById: async (
    id: number,
  ): Promise<ApiResponse<CashbookTransferItem>> => {
    return await api.get(`${cashbookTransferUrl}/${id}`);
  },

  createTransfer: async (
    payload: CreateCashbookTransferPayload,
  ): Promise<ApiResponse<CashbookTransferItem>> => {
    return await api.post(cashbookTransferUrl, payload);
  },

  updateTransfer: async (
    id: number,
    payload: CreateCashbookTransferPayload,
  ): Promise<ApiResponse<CashbookTransferItem>> => {
    return await api.post(`${cashbookTransferUrl}/${id}`, payload);
  },

  confirmTransfer: async (
    id: number,
  ): Promise<ApiResponse<CashbookTransferItem>> => {
    return await api.patch(`${cashbookTransferUrl}/${id}/confirm`);
  },

  rejectTransfer: async (
    id: number,
  ): Promise<ApiResponse<CashbookTransferItem>> => {
    return await api.patch(`${cashbookTransferUrl}/${id}/reject`);
  },

  getAdjustments: async (
    params?: AccountFilters,
  ): Promise<CashbookAdjustmentsListResponse> => {
    return await api.get(cashbookAdjustmentUrl, { params });
  },

  getAdjustmentById: async (
    id: number,
  ): Promise<ApiResponse<CashbookAdjustment>> => {
    return await api.get(`${cashbookAdjustmentUrl}/${id}`);
  },

  createAdjustment: async (
    payload: CreateCashbookAdjustmentPayload,
  ): Promise<ApiResponse<CashbookAdjustment>> => {
    return await api.post(cashbookAdjustmentUrl, payload);
  },

  updateAdjustment: async (
    id: number,
    payload: CreateCashbookAdjustmentPayload,
  ): Promise<ApiResponse<CashbookAdjustment>> => {
    return await api.put(`${cashbookAdjustmentUrl}/${id}`, payload);
  },

  confirmAdjustment: async (
    id: number,
  ): Promise<ApiResponse<CashbookAdjustment>> => {
    return await api.patch(`${cashbookAdjustmentUrl}/${id}/approve`);
  },

  rejectAdjustment: async (
    id: number,
  ): Promise<ApiResponse<CashbookAdjustment>> => {
    return await api.patch(`${cashbookAdjustmentUrl}/${id}/reject`);
  },
};
