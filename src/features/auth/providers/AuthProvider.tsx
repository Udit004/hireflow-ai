"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthProvider, AuthContext } from "../contexts/AuthContext";
import {
  loginUser,
  logoutUser,
  registerUser,
  getUserDocument,
  updateUserRole,
} from "../services/authService";
import { AuthContextType, AuthUser, UserRole } from "../types";

export const AuthProviderComponent = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get user data from Firestore
          const authUser = await getUserDocument(firebaseUser.uid);
          setUser(authUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        setError(err instanceof Error ? err.message : "Authentication error");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login handler
  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null);
      const authUser = await loginUser(email, password);
      setUser(authUser);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    }
  };

  // Register handler
  const handleRegister = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole
  ) => {
    try {
      setError(null);
      const authUser = await registerUser(email, password, displayName, role);
      setUser(authUser);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      throw err;
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      setError(null);
      await logoutUser();
      setUser(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
      throw err;
    }
  };

  // Update user role handler
  const handleUpdateUserRole = async (role: UserRole) => {
    try {
      setError(null);
      if (!user) throw new Error("User not found");
      await updateUserRole(user.uid, role);
      setUser({ ...user, role });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Update role failed";
      setError(errorMessage);
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUserRole: handleUpdateUserRole,
  };

  return <AuthProvider value={value}>{children}</AuthProvider>;
};
