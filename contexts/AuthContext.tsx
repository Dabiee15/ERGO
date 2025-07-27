"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  User
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, dbclient } from "@/lib/dbclient";

interface AuthUser extends User {
  companyName?: string;
  onboarding?: {
    connectAccount?: boolean;
    importFile?: boolean;
  };
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, companyName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  getIdToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
  loading: true,
  getIdToken: async () => "",
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(dbclient, "users", firebaseUser.uid));
        const userData = userDoc.data();
        
        const authUser: AuthUser = {
          ...firebaseUser,
          companyName: userData?.companyName,
          onboarding: userData?.onboarding
        };
        
        setUser(authUser);
        localStorage.setItem("authUser", JSON.stringify(authUser));
      } else {
        setUser(null);
        localStorage.removeItem("authUser");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(dbclient, "users", userCredential.user.uid));
      const userData = userDoc.data();

      const authUser: AuthUser = {
        ...userCredential.user,
        companyName: userData?.companyName,
        onboarding: userData?.onboarding
      };

      setUser(authUser);
      localStorage.setItem("authUser", JSON.stringify(authUser));

      if (!userData?.onboarding?.connectAccount) {
        router.push("/onboarding/connect");
      } else if (!userData?.onboarding?.importFile) {
        router.push("/onboarding/import");
      } else {
        router.push("/dashboard");
      }

      return { success: true };
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      return { success: false, error: error.message };
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
      await auth.signOut();
      setUser(null);
      localStorage.removeItem("authUser");
      router.push("/login");
    } catch (error) {
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