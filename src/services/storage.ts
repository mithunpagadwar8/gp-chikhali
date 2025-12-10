// src/services/storage.ts
export const getStoredData = <T = any>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setStoredData = (key: string, value: any) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const getPublicUser = () => {
  return getStoredData("publicUser");
};
