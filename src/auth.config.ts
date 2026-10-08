import NextAuth, { User, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { AdapterUser } from "next-auth/adapters";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/new-account",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.data = user;
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user = token.data as AdapterUser & {
        id: string;
        name: string;
        email: string;
        role: string;
        emailVerified?: boolean;
        image?: string;
      } & User;

      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        // Buscar usuario por email
        const user = await prisma.user.findUnique({
          where: {
            email: email.toLowerCase(),
          },
        });

        if (!user) return null;

        // Comparar contraseñas
        if (!bcrypt.compareSync(password, user.password)) return null;

        // Regresar el usuario sin el password
        const { password: _password, ...rest } = user;
        void _password;
        return rest;
      },
    }),
  ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
