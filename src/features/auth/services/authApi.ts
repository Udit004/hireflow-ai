import axios from "axios";
import type { User as FirebaseUser } from "firebase/auth";

import type { UserRole } from "../types";

export interface BackendUserResponse {
  uid: string;
  email: string | null;
  display_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

async function authHeaders(user: FirebaseUser) {
  const idToken = await user.getIdToken();
  return {
    Authorization: `Bearer ${idToken}`,
  };
}

export async function syncBackendUser(
  user: FirebaseUser,
  role: UserRole,
  displayName?: string | null,
) {
  const response = await backendApi.post<BackendUserResponse>(
    "/api/v1/users/sync",
    {
      uid: user.uid,
      email: user.email,
      display_name: displayName ?? user.displayName,
      role,
    },
    {
      headers: await authHeaders(user),
    },
  );

  return response.data;
}

export async function getBackendUser(user: FirebaseUser) {
  const response = await backendApi.get<BackendUserResponse>(
    `/api/v1/users/${user.uid}`,
    {
      headers: await authHeaders(user),
    },
  );

  return response.data;
}
