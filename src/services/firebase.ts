import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrq3HQJS7tTmxGnnnPP7eXW_D8EBbgtsE",
  authDomain: "grampanchayatchikhali-853fe.firebaseapp.com",
  projectId: "grampanchayatchikhali-853fe",
  storageBucket: "grampanchayatchikhali-853fe.appspot.com",
  messagingSenderId: "36658942460",
  appId: "1:36658942460:web:305a97df8580c94519a279",
};

export const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Auth
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

// ✅ Google Login
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// ✅ Logout
export const publicSignOut = async () => {
  await signOut(auth);
};
