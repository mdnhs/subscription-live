/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { RegisterFormData } from "@/lib/validations/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const RegisterFormContent = ({
  error,
  handleSubmit,
  onSubmit,
  register,
  errors,
  isLoading,
  isSubmitting,
  usernameAvailable,
  checkingUsername,
  username,
}: {
  error: string | null;
  handleSubmit: any;
  onSubmit: (data: RegisterFormData) => void;
  register: any;
  errors: any;
  isLoading: boolean;
  isSubmitting: boolean;
  usernameAvailable: boolean | null;
  checkingUsername: boolean;
  username: string;
}) => {
  return (
    <form
      className="p-6 md:p-8"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      autoComplete="off"
    >
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Register</h1>
          <p className="text-balance text-muted-foreground">
            Create a new account to get started
          </p>
        </div>

        <UsernameInput
          register={register}
          errors={errors}
          usernameAvailable={usernameAvailable}
          checkingUsername={checkingUsername}
          username={username}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
        />

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
            disabled={isLoading || isSubmitting}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            disabled={isLoading || isSubmitting}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            disabled={isLoading || isSubmitting}
            className={errors.confirmPassword ? "border-red-500" : ""}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-brand-1 hover:bg-brand-2 disabled:opacity-50"
          disabled={isLoading || isSubmitting || usernameAvailable === false}
        >
          {isLoading || isSubmitting ? "Signing up..." : "Sign Up"}
        </Button>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
};

export default RegisterFormContent;

function UsernameInput({
  register,
  errors,
  usernameAvailable,
  checkingUsername,
  username,
  isLoading,
  isSubmitting,
}: {
  register: any;
  errors: any;
  usernameAvailable: boolean | null;
  checkingUsername: boolean;
  username: string;
  isLoading: boolean;
  isSubmitting: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="userName">Username</Label>
      <div className="relative">
        <Input
          id="userName"
          type="text"
          placeholder="Enter your username"
          {...register("userName")}
          disabled={isLoading || isSubmitting}
          className={cn(
            errors.userName ? "border-red-500" : "",
            usernameAvailable === true ? "border-green-500 pr-10" : "",
            usernameAvailable === false ? "border-red-500 pr-10" : ""
          )}
        />
        {checkingUsername && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
        {usernameAvailable === true && !checkingUsername && username && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {usernameAvailable === false && !checkingUsername && username && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      {errors.userName && (
        <p className="text-sm text-red-500">{errors.userName.message}</p>
      )}
      {usernameAvailable === true && username && !errors.userName && (
        <p className="text-sm text-green-500">Username is available!</p>
      )}
      {usernameAvailable === false && username && !errors.userName && (
        <p className="text-sm text-red-500">Username is already taken!</p>
      )}
    </div>
  );
}
