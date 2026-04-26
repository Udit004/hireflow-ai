"use client";

import { ProtectedRoute } from "@/features/auth";
import { TestGenerationWorkbench } from "@/features/testGeneration";

export default function CreateTest() {
  return (
    <ProtectedRoute requiredRole="recruiter">
      <TestGenerationWorkbench />
    </ProtectedRoute>
  );
}
