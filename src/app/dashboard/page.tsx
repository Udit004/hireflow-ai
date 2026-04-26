"use client";

import { ProtectedRoute } from "@/features/auth";
import { DashboardPageContent } from "@/features/dashboard";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  );
}
