import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  // Obtener el token JWT directamente
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  // Rutas de veterinario requieren rol de veterinario
  if (pathname.startsWith("/veterinario")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token.role !== "veterinario") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Rutas de cliente (agendar-cita, mis-citas) solo para dueños
  if (
    pathname.startsWith("/agendar-cita") ||
    pathname.startsWith("/mis-citas")
  ) {
    if (token && token.role === "veterinario") {
      return NextResponse.redirect(new URL("/veterinario/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
