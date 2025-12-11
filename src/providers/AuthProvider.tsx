import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../services/firebase";
import { Navigate } from "react-router-dom";

const ADMIN_EMAIL = "mithunpagadwar8@gmail.com";

// Auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
});

// Provider to wrap around the app and provide context values
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setIsAdmin(u.email === ADMIN_EMAIL);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
export const useAuth = () => useContext(AuthContext);

// Admin protected route (only admins can access)
export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, isAdmin } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

// Citizen protected route (only logged-in users can access)
export const CitizenProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, user } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
};
