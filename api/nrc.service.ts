import { API_CONSTANT } from "@/constants/api.constant";
import { api } from "@/lib/axios";
import { Filters } from "@/types/api.type";

export interface NRC {
  id: number;
  name_en: string;
  name_mm: string;
  nrc_code: string;
}

export interface NRCListResponse {
  response: { status: string; message: string };
  data: NRC[];
}

const version = "v1";
const baseUrl = `/${version}/${API_CONSTANT.NRC}`;

export const nrcService = {
  getAll: (code?: string): Promise<NRCListResponse> =>
    api.get(`${baseUrl}/${code}/township-code`),
};
