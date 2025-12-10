import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrq3HQJS7tTmxGnnnPP7eXW_D8EBbgtsE",
  authDomain: "grampanchayatchikhali-853fe.firebaseapp.com",
  projectId: "grampanchayatchikhali-853fe",
  storageBucket: "grampanchayatchikhali-853fe.firebasestorage.app",
  messagingSenderId: "36658942460",
  appId: "1:36658942460:web:305a97df8580c94519a279",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
