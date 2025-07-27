"use client";
import { useState, useEffect, useCallback } from "react";
import { Loader2, LinkIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function IndexPage() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading]);

  useEffect(() => {
  if (!authLoading && user) {
    if (user.accountId) {
      // If already linked account, skip to import stage
      router.push("/onboarding/import");
    }
  }
}, [user, authLoading]);


  const openMonoWidget = useCallback(async () => {
    setLoading(true);
    const MonoConnect = (await import("@mono.co/connect.js")).default;

    const monoInstance = new MonoConnect({
      key: "test_pk_i8y0hjauww9h0nm7z8fx",
      onClose: () => {
        setLoading(false);
        console.log("Widget closed");
      },
      onLoad: () => {
        setScriptLoaded(true);
        setLoading(false);
      },
      onSuccess: async ({ code }) => {
          try {
            const res = await fetch("/api/mono/exchange", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ code }),
            });

            const data = await res.json();
            console.log(code)
            console.log("Account linked:", data.accountId);
          } catch (err) {
            console.error("Failed to link account:", err);
          }
          router.push("/onboarding/import")
        }
    });

    monoInstance.setup();
    monoInstance.open();
  }, []);

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-emerald-600" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-emerald-100 to-white flex items-center justify-center p-6">
      <div className="bg-white/40 backdrop-blur-md border border-emerald-200 shadow-lg rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-semibold text-emerald-700">
          Welcome, {user?.companyName}!
          <br />
          Link Your Financial Account
        </h1>
        <p className="text-gray-600 text-sm">
          Securely connect your bank account using Mono Connect.
        </p>

        <button
          onClick={openMonoWidget}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Launching...
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4" />
              Link a financial account
            </>
          )}
        </button>

        {!scriptLoaded && (
          <p className="text-xs text-gray-500">
            Mono Connect script will load dynamically when button is clicked.
          </p>
        )}
      </div>
    </main>
  );
}
