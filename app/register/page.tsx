"use client";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Register() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm />
      </div>
    </section>
  );
}
