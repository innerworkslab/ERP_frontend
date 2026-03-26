/* eslint-disable @typescript-eslint/no-explicit-any */
export function cleanObject<T extends Record<string, any>>(
  obj?: T,
): Partial<T> {
  if (!obj) return {};

  const result: Partial<T> = {};

  for (const key in obj) {
    const value = obj[key];
    if (value !== null && value !== undefined && value !== "") {
      result[key] = value;
    }
  }

  return result;
}

export const formatDate = (date: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
