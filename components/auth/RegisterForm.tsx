"use client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RegisterFormData, registerSchema } from "@/lib/validations/auth";
import { doRegister } from "@/services/api/authRequest.";
import { getTotalUsers, updateUser } from "@/services/api/userRequest";
import useFetch from "@/services/fetch/csrFecth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import RegisterFormContent from "./RegisterFormContent";
import SuccessDialog from "./SuccessDialog";

export function RegisterForm({ className, ...props }: { className?: string }) {
  const router = useRouter();
  const { fetchPublic } = useFetch();
  const searchParams = useSearchParams();
  const referId = searchParams.get("referId");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);
  const [debouncedUsername, setDebouncedUsername] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [registeredUsername, setRegisteredUsername] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [formData, setFormData] = useState<RegisterFormData | null>(null);
  const [registrationData, setRegistrationData] = useState<{
    jwt: string;
    user: { id: number; documentId: string };
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const username = watch("userName");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (username && username.length >= 3 && username !== debouncedUsername) {
        setDebouncedUsername(username);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username, debouncedUsername]);

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (!debouncedUsername || debouncedUsername.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      setCheckingUsername(true);
      try {
        const req = getTotalUsers();
        const res = await fetchPublic(req);

        if (res.success && res.data) {
          const isUsernameTaken = res.data.some(
            (user: { username: string }) =>
              user.username.toLowerCase() === debouncedUsername.toLowerCase()
          );
          setUsernameAvailable(!isUsernameTaken);
        } else {
          console.error("Failed to check username:", res.message);
          setUsernameAvailable(null);
        }
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    };

    if (debouncedUsername) {
      checkUsernameAvailability();
    }
  }, [debouncedUsername, fetchPublic]);

  useEffect(() => {
    const updateUserVia = async () => {
      if (
        isDialogOpen &&
        referId &&
        registrationData?.jwt &&
        registrationData?.user?.id
      ) {
        try {
          const payload = { via: referId };
          const req = updateUser(
            registrationData.jwt,
            registrationData.user.id,
            payload
          );
          const response = await fetchPublic(req);

          if (!response.success) {
            throw new Error(response.message || "Update failed");
          }

          toast.success("Referral updated successfully!");
        } catch (error) {
          toast.error("Failed to update referral");
          console.error("Referral update error:", error);
        }
      }
    };

    updateUserVia();
  }, [isDialogOpen, referId, registrationData, fetchPublic]);

  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      setIsLoading(true);
      setError(null);

      if (usernameAvailable === false) {
        setError("Username is already taken. Please choose another one.");
        setIsLoading(false);
        return;
      }

      const payload = {
        username: data.userName,
        email: data.email,
        password: data.password,
      };

      try {
        const req = doRegister(payload);
        const res = await fetchPublic(req);

        if (!res.success) {
          const errorMessage = res.message || "Registration failed, Try Again!";
          setError(errorMessage);
          toast.error(errorMessage);
          return;
        }

        setRegistrationData({
          jwt: res.data.jwt,
          user: { id: res.data.user.id, documentId: res.data.user.documentId },
        });
        toast.success("Account created successfully!");
        setRegisteredUsername(data.userName);
        setFormData(data);
        setIsDialogOpen(true);
      } catch (error: unknown) {
        console.error("Registration error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPublic, usernameAvailable]
  );

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(registeredUsername);
    setIsCopied(true);
    toast.success("Username copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCloseDialog = async () => {
    setIsDialogOpen(false);

    if (formData) {
      try {
        const result = await signIn("credentials", {
          identifier: formData.email,
          password: formData.password,
          redirect: false,
          callbackUrl: "/",
        });

        if (result?.error) {
          toast.error("Automatic login failed. Please log in manually.");
          router.push("/login?registered=true");
        } else if (result?.url) {
          router.push(result.url);
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Automatic login failed. Please log in manually.");
        router.push("/login?registered=true");
      }
    } else {
      router.push("/login?registered=true");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <RegisterFormContent
            error={error}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            errors={errors}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            usernameAvailable={usernameAvailable}
            checkingUsername={checkingUsername}
            username={username}
          />
          <div className="relative hidden bg-muted md:block rounded-l-xl overflow-hidden">
            <Image
              src="/bg/auth-bg.svg"
              alt="Registration background"
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

      <SuccessDialog
        isDialogOpen={isDialogOpen}
        registeredUsername={registeredUsername}
        isCopied={isCopied}
        handleCopyUsername={handleCopyUsername}
        handleCloseDialog={handleCloseDialog}
      />
    </div>
  );
}
