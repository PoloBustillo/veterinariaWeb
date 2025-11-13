import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;
      
      const isOnAgendarCita = nextUrl.pathname.startsWith("/agendar-cita");
      const isOnMisCitas = nextUrl.pathname.startsWith("/mis-citas");
      const isOnVeterinario = nextUrl.pathname.startsWith("/veterinario");
      const isOnMisMascotas = nextUrl.pathname.startsWith("/mis-mascotas");
      const isOnRegistrarMascota = nextUrl.pathname.startsWith("/registrar-mascota");

      // Rutas de veterinario - requieren login y rol veterinario
      if (isOnVeterinario) {
        return isLoggedIn && userRole === "veterinario";
      }

      // Rutas de cliente - requieren login y NO ser veterinario
      if (isOnAgendarCita || isOnMisCitas || isOnMisMascotas || isOnRegistrarMascota) {
        return isLoggedIn && userRole !== "veterinario";
      }

      // Otras rutas son públicas
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
