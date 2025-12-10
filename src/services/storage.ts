// src/services/storage.ts

// ✅ Get data from localStorage
export const getStoredData = <T = any>(key: string): T | null => {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// ✅ Save data to localStorage
export const setStoredData = (key: string, value: any) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

// ✅ Public logged-in user (Google user)
export const getPublicUser = () => {
  return getStoredData("publicUser");
};

// ✅ Convert file to base64 (Admin uploads use this)
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ✅ AUTH CHECK — THIS FIXES App.tsx ERROR
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;

  const user = localStorage.getItem("publicUser");
  return !!user;
};
