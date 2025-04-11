import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextAuthConfig } from "next-auth";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers"; // For app router support

const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL;
const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("Missing NEXTAUTH_SECRET environment variable.");
}

export async function getServerToken() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    ?.getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const token = await getToken({
    req: { headers: { cookie: cookieHeader } },
    secret,
  });

  return token?.user?.jwt ?? null;
}

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          const response = await axios.post(
            `${apiUrl}/api/auth/local`,
            {
              identifier: credentials.identifier,
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              timeout: 5000,
            }
          );

          if (response.status !== 200) {
            console.log("Strapi returned non-200 status:", response.status);
            return null;
          }

          return {
            id: response.data.user.id.toString(),
            name: response.data.user.username,
            email: response.data.user.email,
            jwt: response.data.jwt,
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.log("Axios error details:", {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status,
            });
          } else {
            console.log("Unexpected error:", error);
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user as {
          id: string;
          name: string;
          email: string;
          jwt: string;
        };
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
