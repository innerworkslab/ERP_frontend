import Cookies from "js-cookie";
import { decryptData, encryptData } from "./encryption-decryption";
const env = process.env.NEXT_PUBLIC_ENV || "development";

export function setEncryptedCookie(key: string, value: object) {
  const encryptedValue = encryptData(value);
  Cookies.set(key, encryptedValue!, {
    expires: 30,
    secure: env === "production",
  });
}

export function getDecryptedCookie(key: string) {
  const encryptedValue = Cookies.get(key)!;
  return decryptData(encryptedValue);
}

export function deleteCookie(key: string) {
  Cookies.remove(key);
}
