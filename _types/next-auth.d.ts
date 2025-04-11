// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      name: string;
      email: string;
      jwt: string;
    };
  }
}
