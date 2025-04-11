import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function Login() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </section>
  );
}
