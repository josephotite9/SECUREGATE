import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      emailVerified: Date | null;
      createdAt: Date | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    emailVerified: Date | null;
    createdAt: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    emailVerified: Date | null;
    createdAt: Date | null;
  }
}
