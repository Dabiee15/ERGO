"use client";

// import { createContext, useContext, useEffect, useState, ReactNode } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// type User = {
//   uid: string;
//   email: string;
//   companyName?: string;
//   emailVerified?: boolean;
// };

// type AuthContextValue = {
//   user: User | null;
//   login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
//   signup: (email: string, password: string, companyName: string) => Promise<{ success: boolean; error?: string }>;
//   logout: () => Promise<void>;
//   loading: boolean;
//   refreshUser: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextValue>({
//   user: null,
//   login: async () => ({ success: false }),
//   signup: async () => ({ success: false }),
//   logout: async () => {},
//   loading: true,
//   refreshUser: async () => {},
// });

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const fetchUser = async () => {
//     try {
//       const res = await fetch("/api/auth/currentuser", {
//         credentials: "include",
//       });
      
//       if (res.ok) {
//         const data = await res.json();
//         console.log(data)
//         setUser(data?.user);
//       } else {
//         setUser(null);
//       }
//     } catch (err) {
//       console.error("AuthContext fetch error:", err);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshUser = async () => {
//     await fetchUser();
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Login failed");
//       }

//       setUser(data.user);
//       router.push("/dashboard");
//       return { success: true };
//     } catch (error) {
//       const message = error instanceof Error ? error.message : "Login failed";
//       toast.error(message);
//       return { success: false, error: message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signup = async (email: string, password: string, companyName: string) => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password, companyName }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Signup failed");
//       }

//       return { success: true };
//     } catch (error) {
//       const message = error instanceof Error ? error.message : "Signup failed";
//       toast.error(message);
//       return { success: false, error: message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       setLoading(true);
//       await fetch("/api/auth/logout", {
//         method: "POST",
//       });
//       setUser(null);
//       router.push("/login");
//     } catch (error) {
//       console.error("Logout failed:", error);
//       toast.error("Logout failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       login, 
//       signup, 
//       logout, 
//       loading,
//       refreshUser 
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged,signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { auth } from "@/lib/dbclient";


type User = {
  uid: string;
  email: string;
  companyName?: string;
  emailVerified?: boolean;
};

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, companyName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
  loading: true,
  refreshUser: async () => {},
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
        setUser(data.user);
        localStorage.setItem("authUser", JSON.stringify(data.user)); // ✅ save to localStorage
      } else {
        setUser(null);
        localStorage.removeItem("authUser");
      }
    } catch (err) {
      console.error("AuthContext fetch error:", err);
      setUser(null);
      localStorage.removeItem("authUser");
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  useEffect(() => {
    const localUser = localStorage.getItem("authUser");
    if (localUser) {
      setUser(JSON.parse(localUser));
      setLoading(false); 
      fetchUser(); // then update from backend
    } else {
      fetchUser();
    }
  }, []);

  // const login = async (email: string, password: string) => {
  //   try {
  //     setLoading(true);
  //     const res = await fetch("/api/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) throw new Error(data.error || "Login failed");

  //     setUser(data.user);
  //     localStorage.setItem("authUser", JSON.stringify(data.user)); 
  //     router.push("/dashboard");
  //     return { success: true };
  //   } catch (error) {
  //     const message = error instanceof Error ? error.message : "Login failed";
  //     toast.error(message);
  //     return { success: false, error: message };
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const redirectBasedOnOnboarding = (user: User) => {
    const onboarding = user?.onboarding;

    if (!onboarding?.connectAccount) {
      router.push("/onboarding/connect");
    } else if (!onboarding?.importFile) {
      router.push("/onboarding/import");
    } else {
      router.push("/dashboard");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCred.user); 
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      setUser(data.user);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      redirectBasedOnOnboarding(data.user);

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

      if (!res.ok) throw new Error(data.error || "Signup failed");

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
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      localStorage.removeItem("authUser"); // 
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
