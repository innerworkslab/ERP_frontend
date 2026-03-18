import { useState } from "react";
import { AxiosError } from "axios";

export function useApi<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async (fn: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      return await fn();
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message || err.message || "Something went wrong",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error };
}
