import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAgendarCita = nextUrl.pathname.startsWith("/agendar-cita");
      const isOnMisCitas = nextUrl.pathname.startsWith("/mis-citas");
      const isOnVeterinario = nextUrl.pathname.startsWith("/veterinario");

      if (isOnAgendarCita || isOnMisCitas || isOnVeterinario) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
