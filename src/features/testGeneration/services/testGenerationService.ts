import axios from "axios";

import type {
  TestGenerationRequest,
  TestGenerationResponse,
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

export async function generateTest(
  payload: TestGenerationRequest,
): Promise<TestGenerationResponse> {
  try {
    const response = await apiClient.post<TestGenerationResponse>(
      "/api/v1/generate-test",
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage("Unable to generate the test.", error));
  }
}
