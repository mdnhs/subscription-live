import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
      credentials({
        name: "Credentials",
        id: "credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials) return null;
  
          await connectDB();
          const user = await User.findOne({
            email: credentials.email,
          }).select("+password");
  
          if (!user) throw new Error("Wrong Email");
  
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
  
          if (!passwordMatch) throw new Error("Wrong Password");
          
          // Return user object with role
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
          };
        },
      }),
    ],
    session: {
      strategy: "jwt",
    },
    callbacks: {
      // Add role to JWT
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.role = user.role;
        }
        return token;
      },
      // Add role to session
      async session({ session, token }) {
        if (token?.id) {
          session.user.id = token.id as string;
        }
        if (token?.role) {
          session.user.role = token.role as string;
        }
        return session;
      },
    },
  };
  
  // Update the NextAuth session type declaration if you're using TypeScript
  declare module "next-auth" {
    interface Session {
      user: {
        id: string;
        name?: string | null;
        email?: string | null;
        role?: string;
      };
    }
  
    interface User {
      id: string;
      role: string;
    }
  }
  
  declare module "next-auth/jwt" {
    interface JWT {
      id: string;
      role: string;
    }
  }