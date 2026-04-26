import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { Suspense } from "react";

export const metadata = {
  title: "Register - HireFlow",
  description: "Create your HireFlow account",
};

export default function RegisterPage() {
  return 
  <Suspense fallback={<div>Loading...</div>}>
    <RegisterForm />;
  </Suspense>

}
