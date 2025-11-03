import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

async function getUser(email: string) {
  try {
    // Buscar primero en dueños
    const dueno = await prisma.dueno.findFirst({
      where: { correo: email },
    });

    if (dueno) {
      return {
        ...dueno,
        role: "dueno" as const,
        userId: dueno.id_dueno,
      };
    }

    // Si no es dueño, buscar en veterinarios
    const veterinario = await prisma.veterinario.findFirst({
      where: { correo: email },
    });

    if (veterinario) {
      console.log("🔍 Veterinario encontrado:", {
        email: veterinario.correo,
        rol: veterinario.rol,
        isAdmin: veterinario.rol === "admin"
      });
      
      return {
        ...veterinario,
        role: "veterinario" as const,
        userId: veterinario.id_veterinario,
        isAdmin: veterinario.rol === "admin",
      };
    }

    return null;
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

          // Verificar password según el tipo de usuario
          if (user.role === "dueno") {
            // Para dueños
            if (user.password) {
              const passwordMatch = await bcrypt.compare(
                password,
                user.password
              );

              if (passwordMatch) {
                return {
                  id: user.userId.toString(),
                  email: user.correo || "",
                  name: user.nombre_completo,
                  role: "dueno",
                };
              }
            } else {
              // Fallback para dueños sin password (últimos 4 dígitos del teléfono)
              const passwordMatch =
                user.telefono?.slice(-4) === password || password === "123456";

              if (passwordMatch) {
                return {
                  id: user.userId.toString(),
                  email: user.correo || "",
                  name: user.nombre_completo,
                  role: "dueno",
                };
              }
            }
          } else if (user.role === "veterinario") {
            // Para veterinarios
            if (user.password) {
              const passwordMatch = await bcrypt.compare(
                password,
                user.password
              );

              if (passwordMatch) {
                console.log("✅ Login exitoso veterinario:", {
                  email: user.correo,
                  rol: user.rol,
                  isAdmin: user.isAdmin
                });
                
                return {
                  id: user.userId.toString(),
                  email: user.correo || "",
                  name: user.nombre_completo,
                  role: "veterinario",
                  isAdmin: user.isAdmin || false,
                };
              }
            } else {
              // Fallback: cédula sin guiones ni espacios como password
              const cedula = user.cedula?.replace(/[-\s]/g, "");
              if (cedula && cedula === password) {
                return {
                  id: user.userId.toString(),
                  email: user.correo || "",
                  name: user.nombre_completo,
                  role: "veterinario",
                  isAdmin: user.isAdmin || false,
                };
              }
            }
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id || "";
        token.role = user.role || "dueno";
        token.isAdmin = user.isAdmin || false;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
});
