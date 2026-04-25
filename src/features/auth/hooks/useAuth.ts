"use client";

import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { AuthContextType } from "../types";

/**
 * Custom hook to use Auth Context
 * Must be used within a component wrapped by AuthProviderComponent
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProviderComponent");
  }

  return context;
};
