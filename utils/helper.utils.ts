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
