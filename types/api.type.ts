export interface Filters {
  search?: string;
  page: number;
}

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    current_page: number;
    total_pages: number;
    per_page: number;
    total: number;
  };
  response?: {
    message: string;
    status: string;
  };
}

export interface ApiResult<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  status: string;
  message: string;
  error: string | null;
}
