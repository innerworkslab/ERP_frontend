import { decryptData, encryptData } from "./encryption-decryption";

export function setEncryptedLocalStorage(key: string, value: object) {
  if (!key || !value) {
    console.error("Key and value must be provided for local storage.");
    return;
  }
  const encryptedValue = encryptData(value);
  localStorage.setItem(key, encryptedValue!);
}

export function getDecryptedLocalStorage(key: string) {
  if (!key) {
    console.error("Key must be provided to retrieve from local storage.");
    return null;
  }
  const encryptedValue = localStorage.getItem(key);
  if (encryptedValue) {
    return decryptData(encryptedValue);
  }
  return null;
}

export function deleteLocalStorage(key: string) {
  if (!key) {
    console.error("Key must be provided to delete from local storage.");
    return;
  }
  localStorage.removeItem(key);
}
