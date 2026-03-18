import CryptoJS from "crypto-js";

const secretKey =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default_secret_key";

export function encryptData(data: object | string) {
  if (!data) return null;
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

export function decryptData(ciphertext: string) {
  if (!ciphertext) return null;
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  try {
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    console.error("Failed to decrypt data:", err);
    return null;
  }
}
