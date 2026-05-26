/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginToken: { label: "Login Token", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.loginToken) {
          const tokenRecord = await prisma.verificationToken.findUnique({
            where: { token: credentials.loginToken },
          });

          if (!tokenRecord || tokenRecord.expires < new Date()) {
            if (tokenRecord) {
              await prisma.verificationToken.delete({ where: { token: credentials.loginToken } });
            }
            throw new Error("Invalid or expired login link.");
          }

          const user = await prisma.user.findUnique({
            where: { email: tokenRecord.identifier },
          });

          if (!user || user.emailVerified === null) {
            throw new Error("Account not verified.");
          }

          await prisma.verificationToken.delete({ where: { token: credentials.loginToken } });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
          };
        }

        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        if (user.emailVerified === null) {
          throw new Error("Please verify your email before logging in.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = (user as any).emailVerified;
        token.createdAt = (user as any).createdAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).emailVerified = token.emailVerified;
        (session.user as any).createdAt = token.createdAt;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
