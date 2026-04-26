import axios from "axios";
import { auth } from "@/lib/firebase";

import type {
  CandidateAttemptHistoryItem,
  PublicTestResponse,
  PublishTestResponse,
  RecruiterAttemptListItem,
  SavedTestResponse,
  SubmitAttemptRequest,
  SubmitAttemptResponse,
  TestGenerationRequest,
} from "../types";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

function getErrorMessage(fallback: string, error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data;

    if (typeof detail === "string") {
      return detail;
    }

    if (detail && typeof detail === "object" && "detail" in detail) {
      const message = (detail as { detail?: unknown }).detail;

      if (typeof message === "string") {
        return message;
      }
    }
  }

  return fallback;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("You must be logged in to perform this action.");
  }

  const idToken = await currentUser.getIdToken();
  return {
    Authorization: `Bearer ${idToken}`,
  };
}

export async function generateTest(
  payload: TestGenerationRequest,
): Promise<SavedTestResponse> {
  try {
    const headers = await getAuthHeaders();

    const response = await apiClient.post<SavedTestResponse>(
      "/api/v1/tests/generate",
      payload,
      { headers },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage("Unable to generate the test.", error));
  }
}

export async function publishTest(testId: string): Promise<PublishTestResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.post<PublishTestResponse>(
      `/api/v1/tests/${testId}/publish`,
      {},
      { headers },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage("Unable to publish test.", error));
  }
}

export async function getSavedTest(testId: string): Promise<SavedTestResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get<SavedTestResponse>(`/api/v1/tests/${testId}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage("Unable to load test details.", error));
  }
}

export async function getTestAttempts(testId: string): Promise<RecruiterAttemptListItem[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get<RecruiterAttemptListItem[]>(
      `/api/v1/tests/${testId}/attempts`,
      { headers },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage("Unable to load test attempts.", error));
  }
}

export async function getCandidateAttemptHistory(uid: string): Promise<CandidateAttemptHistoryItem[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get<CandidateAttemptHistoryItem[]>(
      `/api/v1/users/${uid}/attempts`,
      { headers },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage("Unable to load your attempt history.", error));
  }
}

export async function getPublicTest(slug: string): Promise<PublicTestResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get<PublicTestResponse>(`/api/v1/public/tests/${slug}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage("Unable to load public test.", error));
  }
}

export async function submitPublicTest(
  slug: string,
  payload: SubmitAttemptRequest,
): Promise<SubmitAttemptResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.post<SubmitAttemptResponse>(
      `/api/v1/public/tests/${slug}/submit`,
      payload,
      { headers },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage("Unable to submit test.", error));
  }
}
