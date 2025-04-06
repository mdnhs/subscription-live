import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextAuthConfig } from "next-auth";

const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL;

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // auth.ts
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
              timeout: 5000, // 5 second timeout
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
    // Include JWT token in the session
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token.user as any;
      return session;
    },
    // Add user info and JWT to the token
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
