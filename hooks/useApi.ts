/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from "@/types/api.type";
import { cleanObject } from "@/utils/helper.utils";
import { useState, useCallback } from "react";

interface RequestOptions<T> {
  params?: Record<string, any>;
  onSuccess?: (data: T) => void;
  onError?: (message: string) => void;
}

export function useApi<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async (
      fn: (params?: any) => Promise<T>,
      options?: RequestOptions<T>,
    ): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const cleanedParams = cleanObject(options?.params);

        const res = await fn(cleanedParams);

        options?.onSuccess?.(res);

        return res;
      } catch (err: unknown) {
        const errorMessage =
          (err as ApiError)?.message ||
          (err as ApiError)?.error ||
          (typeof err === "string" ? err : "An unexpected error occurred");

        setError(errorMessage);
        options?.onError?.(errorMessage);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { request, loading, error };
}
