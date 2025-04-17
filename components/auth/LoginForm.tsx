// File: components/login-form.tsx
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/lib/validations/auth";

export function LoginForm({ className, ...props }: { className?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const callbackUrl = useSearchParams().get("callbackUrl");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await signIn("credentials", {
          identifier: data.identifier,
          password: data.password,
          redirect: false,
          callbackUrl: callbackUrl || "/",
        });

        if (result?.error) {
          setError(
            result.error === "CredentialsSignin"
              ? "Invalid email or password"
              : "Login failed. Please try again."
          );
          return;
        }

        if (result?.url) {
          router.push(result.url);
          router.refresh();
        }
      } catch (error) {
        console.error(error);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [router, callbackUrl]
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Subscription account
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="identifier">Email</Label>
                <Input
                  id="identifier"
                  type="email"
                  placeholder="m@example.com"
                  {...register("identifier")}
                  disabled={isLoading || isSubmitting}
                  className={errors.identifier ? "border-red-500" : ""}
                />
                {errors.identifier && (
                  <p className="text-sm text-red-500">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  disabled={isLoading || isSubmitting}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-1 hover:bg-brand-2 disabled:opacity-50"
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>

          <div className="relative hidden bg-muted md:block rounded-l-xl overflow-hidden">
            <Image
              src="/bg/auth-bg.svg"
              alt="Authentication background"
              fill
              className="inset-0 h-full w-full object-contain dark:brightness-[0.2]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}
