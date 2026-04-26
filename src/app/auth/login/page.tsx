import { LoginForm } from "@/features/auth/components/LoginForm";
import { Suspense } from "react";

export const metadata = {
  title: "Login - HireFlow",
  description: "Sign in to your HireFlow account",
};

export default function LoginPage() {
  return
  <Suspense fallback={<div>Loading...</div>}>
    <LoginForm />;
  </Suspense>

}
