import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { type User } from "../../types/user";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session {
    id: string;
    sessionToken: string;
    userId: string;
    expires: Date;
    user: User; // User data from Prisma
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    ...(() => {
      const includeCredentials =
        process.env.NODE_ENV === "test" || process.env.CYPRESS === "true";

      if (includeCredentials) {
        return [
          CredentialsProvider({
            id: "cypress-credentials",
            name: "Test Account",
            credentials: {
              username: { label: "Username", type: "text" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              if (
                credentials?.username === "admin" &&
                credentials?.password === "admin"
              ) {
                const email = "cypress@test.com";
                const existingUser = await db.user.findUnique({
                  where: { email },
                });

                if (existingUser) {
                  const noDisplayName = await db.user.update({
                    where: { id: existingUser.id },
                    data: {
                      displayName: null,
                    },
                  });
                  return noDisplayName;
                }

                const newUser = await db.user.create({
                  data: {
                    id: "cypressID",
                    name: "Cypress Test User",
                    email,
                  },
                });
                return newUser;
              }
              return null;
            },
          }),
        ];
      }
      return [];
    })(),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  session: {
    strategy:
      process.env.NODE_ENV === "test" || process.env.CYPRESS === "true"
        ? ("jwt" as const)
        : ("database" as const),
    maxAge: 60 * 60, // 1 hour (in seconds)
    updateAge: 60 * 2, // Refresh session every 2 mins
  },
  ...(process.env.NODE_ENV !== "test" &&
    process.env.CYPRESS !== "true" && {
      adapter: PrismaAdapter(db),
    }),
  callbacks: {
    async jwt({ token, user }) {
      // Persist user id to token for JWT strategy
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token, user }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      } else if (user && session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
