import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { app } from "./firebase"; // ✅ SAME app reused

const storage = getStorage(app);

/* ================= UPLOAD ================= */

export const uploadFile = (
  file: File,
  pathPrefix: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileName = `${pathPrefix}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const fileRef = storageRef(storage, fileName);

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (onProgress) {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          onProgress(progress);
        }
      },
      reject,
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
};

/* ================= DELETE ================= */

export const deleteFile = async (fileUrl: string): Promise<void> => {
  const fileRef = storageRef(storage, fileUrl);
  await deleteObject(fileRef);
};
