"use client";

import React, { createContext, ReactNode } from "react";
import { AuthContextType } from "../types";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: AuthContextType;
}) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
