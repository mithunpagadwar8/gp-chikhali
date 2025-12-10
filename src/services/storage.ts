import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

// Firebase Configuration (replace with your Firebase project credentials)
const firebaseConfig = {
  apiKey: "AIzaSyDrq3HQJS7tTmxGnnnPP7eXW_D8EBbgtsE",
  authDomain: "grampanchayatchikhali-853fe.firebaseapp.com",
  projectId: "grampanchayatchikhali-853fe",
  storageBucket: "grampanchayatchikhali-853fe.firebasestorage.app",
  messagingSenderId: "36658942460",
  appId: "1:36658942460:web:305a97df8580c94519a279",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

/**
 * Helper function to upload a file to Firebase Storage
 * @param file The file to be uploaded
 * @param pathPrefix The directory in Firebase Storage where the file will be saved
 * @param onProgress A callback function to monitor the upload progress
 * @returns The download URL of the uploaded file
 */
export const uploadFile = (
  file: File,
  pathPrefix: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create a storage reference with a unique file name
    const fileName = `${pathPrefix}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const fileRef = storageRef(storage, fileName);

    // Start uploading the file
    const uploadTask = uploadBytesResumable(fileRef, file);

    // Monitor the upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        if (onProgress) onProgress(0); // Reset progress on error
        reject(error);
      },
      async () => {
        try {
          // Get the download URL after the upload is complete
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          if (onProgress) onProgress(100); // Upload complete
          resolve(url);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

/**
 * Helper function to delete a file from Firebase Storage
 * @param fileUrl The URL of the file to be deleted
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    // Get a reference to the file from its download URL
    const fileRef = storageRef(storage, fileUrl);
    await deleteObject(fileRef);
    console.log("File deleted successfully.");
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

/**
 * Function to get the CDN URL for the file after uploading it to Firebase Storage.
 * Firebase automatically serves content from its CDN once uploaded.
 * @param file The file to upload
 * @param pathPrefix Directory path in Firebase Storage
 * @param onProgress Callback function for upload progress
 * @returns The CDN URL of the uploaded file
 */
export const getFileCDNUrl = async (
  file: File,
  pathPrefix: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const url = await uploadFile(file, pathPrefix, onProgress);
    return url; // CDN URL will be returned by Firebase Storage
  } catch (error) {
    console.error("Error uploading file to CDN:", error);
    throw error;
  }
};
