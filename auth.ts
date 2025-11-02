import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

async function getUser(email: string) {
  try {
    const user = await prisma.dueno.findFirst({
      where: { correo: email },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(4) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          // Verificar password hasheado con bcrypt
          if (user.password) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
              return {
                id: user.id_dueno.toString(),
                email: user.correo || "",
                name: user.nombre_completo,
              };
            }
          } else {
            // Fallback temporal para usuarios sin password hasheado
            // (últimos 4 dígitos del teléfono o "123456")
            const passwordMatch =
              user.telefono?.slice(-4) === password || password === "123456";

            if (passwordMatch) {
              return {
                id: user.id_dueno.toString(),
                email: user.correo || "",
                name: user.nombre_completo,
              };
            }
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
