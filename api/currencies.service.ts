import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { Filters } from "@/types/api.type";
import { Currency } from "lucide-react";

export type CurrencyFilters = Filters & {
  status?: string;
  search?: string;
};

export interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
  exchange_rate: string | number;
  is_base_currency: boolean;
  last_exchange_rate_update: string | null;
  created_at: string;
  updated_at: string;
}

export interface HistoryRate {
  id: number;
  currency_id: number;
  exchange_rate: string;
  rate_date: string;
  created_at: string;
  updated_at: string;
}

export type CurrencyListResponse = {
  response: { status: string; message: string };
  data: Currency[];
  meta: { total_pages: number; current_page: number; total: number };
};

export interface HistoryRateListResponse {
  response: { status: string; message: string };
  data: HistoryRate[];
  meta: { total_pages: number; current_page: number; total: number };
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.CURRENCY}`;

export const currencyService = {
  getAll: (filters?: CurrencyFilters): Promise<CurrencyListResponse> =>
    api.get(`${baseUrl}`, { params: filters }),

  getById: (id: string | number): Promise<{ data: Currency }> =>
    api.get(`${baseUrl}/${id}`),

  create: (payload: Partial<Currency>) => api.post(baseUrl, payload),

  update: (id: number, payload: Partial<Currency>) =>
    api.put(`${baseUrl}/${id}`, payload),

  updateRate: (id: number, rate: number) =>
    api.put(`${baseUrl}/${id}/update-exchange-rate`, {
      exchange_rate: rate,
    }),

  setBaseCurrency: (id: number) =>
    api.patch(`${baseUrl}/${id}/set-base-currency`),

  getRateHistory: (id: number): Promise<HistoryRateListResponse> =>
    api.get(`${baseUrl}/${id}/exchange-rate-history`),
};
