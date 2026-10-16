"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  isConfigured: false,
  signInWithGoogle: async () => {},
  signInWithPassword: async () => {},
  signUpWithPassword: async () => {},
  signOut: async () => {},
  requireAuth: () => {},
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  authModalMessage: "",
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal control
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState("");
  const [pendingCallback, setPendingCallback] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.error("Error fetching initial session:", error);
      }
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    });

    // 2. Listen for auth changes (OAuth redirect, password login, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (currentUser && pendingCallback) {
        pendingCallback(currentUser);
        setPendingCallback(null);
        setIsAuthModalOpen(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [pendingCallback]);

  const signInWithGoogle = useCallback(
    async (redirectPath = "/careers") => {
      if (!supabase) {
        throw new Error("Supabase is not configured. Please add SUPABASE keys in .env.local.");
      }

      const origin =
        typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || "https://vnoirs.com";

      const redirectTo = `${origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
      return data;
    },
    []
  );

  const signInWithPassword = useCallback(async (email, password) => {
    if (!supabase) {
      throw new Error("Supabase is not configured. Please add SUPABASE keys in .env.local.");
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }, []);

  const signUpWithPassword = useCallback(async (email, password, fullName = "") => {
    if (!supabase) {
      throw new Error("Supabase is not configured. Please add SUPABASE keys in .env.local.");
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error);
    }
    setUser(null);
    setSession(null);
  }, []);

  /**
   * Helper that executes onSuccess immediately if authenticated,
   * otherwise opens the AuthModal and executes onSuccess once the user logs in.
   */
  const requireAuth = useCallback(
    ({ message = "Please sign in to continue", onSuccess }) => {
      if (user) {
        if (onSuccess) onSuccess(user);
        return true;
      }
      setAuthModalMessage(message);
      setPendingCallback(() => onSuccess);
      setIsAuthModalOpen(true);
      return false;
    },
    [user]
  );

  const openAuthModal = useCallback((message = "") => {
    setAuthModalMessage(message);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalMessage("");
    setPendingCallback(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        signInWithGoogle,
        signInWithPassword,
        signUpWithPassword,
        signOut,
        requireAuth,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
