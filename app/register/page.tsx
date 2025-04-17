import { RegisterForm } from "@/components/auth/RegisterForm";
import { Suspense } from "react";

export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <RegisterForm />
        </div>
      </section>
    </Suspense>
  );
}
