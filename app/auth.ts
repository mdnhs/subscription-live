import axios from "axios";
import type { NextAuthConfig, Session } from "next-auth";
import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL;

// Extend the default interfaces
declare module "next-auth" {
  interface User {
    id?: string;
    jwt?: string;
  }

  interface Session {
    user: User & {
      id: string;
      jwt?: string;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      jwt?: string;
    };
  }
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
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
            image: response.data.user.profilePicture || null,
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
    async session({ session, token }: { session: Session; token: JWT }) {
      // console.log("Session callback - token:", token);

      if (token.user) {
        session.user = {
          ...session.user,
          id: token.user.id,
          name: token.user.name || null,
          email: token.user.email || null,
          image: token.user.image || null,
          jwt: token.user.jwt,
        };
      }

      // console.log("Session callback - final session:", session);
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      // console.log("JWT callback - user:", user);
      // console.log("JWT callback - token:", token);

      // Initial sign in
      if (user) {
        token.user = {
          id: user.id || "",
          name: user.name || null,
          email: user.email || null,
          image: user.image || null,
          jwt: user.jwt,
        };
      }

      // Handle session updates
      if (trigger === "update" && session?.user) {
        token.user = {
          ...token.user,
          id: session.user.id,
          name: session.user.name || null,
          email: session.user.email || null,
          image: session.user.image || null,
          jwt: session.user.jwt,
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
