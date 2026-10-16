"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Authenticating with Google...");

  useEffect(() => {
    const handleCallback = async () => {
      const redirectPath = searchParams.get("redirect") || "/careers";

      if (!supabase) {
        router.replace(redirectPath);
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Auth callback error:", error);
        }

        if (data?.session) {
          setStatus("Signed in successfully! Redirecting...");
          setTimeout(() => {
            router.replace(redirectPath);
          }, 600);
          return;
        }

        // Allow Supabase client to process url hash fragment
        setTimeout(async () => {
          const { data: retryData } = await supabase.auth.getSession();
          if (retryData?.session) {
            setStatus("Signed in successfully! Redirecting...");
          }
          router.replace(redirectPath);
        }, 1000);
      } catch (err) {
        console.error("Callback exception:", err);
        router.replace(redirectPath);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center border border-white/10 space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 flex items-center justify-center mx-auto">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <h2 className="text-xl font-bold text-white tracking-tight">Vnoirs Authentication</h2>
      <p className="text-sm text-gray-400">{status}</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Vnoirs Authentication</h2>
            <p className="text-sm text-gray-400">Verifying session...</p>
          </div>
        }
      >
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
