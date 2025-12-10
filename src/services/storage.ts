import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getStoredData, setPublicUser, removePublicUser } from './storage';

// Helper to get auth instance based on dynamic config stored in localStorage
export const getFirebaseAuth = () => {
   const data = getStoredData();
   
   // Check if config exists and has at least an API key
   if (!data.firebaseConfig || !data.firebaseConfig.apiKey) {
       return null;
   }

   try {
      // Avoid duplicate initialization
      if (getApps().length > 0) {
          return getAuth(getApp());
      }
      
      const app = initializeApp(data.firebaseConfig);
      return getAuth(app);
   } catch(e) {
       console.error("Firebase Init Error", e);
       return null;
   }
};

export const signInWithGoogle = async (): Promise<User | null> => {
    const auth = getFirebaseAuth();
    if (!auth) {
        alert("System Error: Google Login is not configured by Admin.");
        return null;
    }

    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Save minimal user info to session storage for easy access in non-async components
        setPublicUser({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
        });
        
        return user;
    } catch (error: any) {
        console.error("Login Failed", error);
        alert(`Login Failed: ${error.message}`);
        return null;
    }
};

export const publicSignOut = async () => {
    const auth = getFirebaseAuth();
    if (auth) {
        await signOut(auth);
    }
    removePublicUser();
    window.location.reload(); // Refresh to update UI state
};
