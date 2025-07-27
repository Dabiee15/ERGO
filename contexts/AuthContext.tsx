
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, dbclient } from "@/lib/dbclient";

type User = {
  uid: string;
  email: string;
  companyName?: string;
  emailVerified?: boolean;
  user: any;
};

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, companyName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  refreshUser: () => Promise<void>;
  getIdToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
  loading: true,
  refreshUser: async () => {},
  getIdToken: async () => { {success: false} },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/currentuser", {
        credentials: "include",
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log(data)
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("AuthContext fetch error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      refreshUser()
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      console.log(data)
      setUser(data.user);
      router.push("/onboarding/connect");
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }

  };

  const signup = async (email: string, password: string, companyName: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, companyName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getIdToken = async () => {
    if (!auth.currentUser) throw new Error("No authenticated user");
    return await auth.currentUser.getIdToken();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );

}

export const useAuth = () => useContext(AuthContext);