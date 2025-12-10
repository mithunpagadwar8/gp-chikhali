// src/services/firebaseStorage.ts
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { app } from "./firebase";

const storage = getStorage(app);

export const uploadFile = (path: string, file: File) => {
  const fileRef = ref(storage, path);
  return uploadBytesResumable(fileRef, file);
};

export const getFileURL = async (path: string) => {
  const fileRef = ref(storage, path);
  return await getDownloadURL(fileRef);
};

export const deleteFile = async (path: string) => {
  const fileRef = ref(storage, path);
  await deleteObject(fileRef);
};
