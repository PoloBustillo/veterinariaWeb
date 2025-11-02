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

  console.log("Middleware - Pathname:", pathname);
  console.log("Middleware - Token exists:", !!token);
  console.log("Middleware - Token role:", token?.role);

  // Rutas de veterinario requieren rol de veterinario
  if (pathname.startsWith("/veterinario")) {
    if (!token) {
      console.log("❌ No token - Redirigiendo a login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token.role !== "veterinario") {
      console.log(
        "❌ No es veterinario (role:",
        token.role,
        ") - Redirigiendo a home"
      );
      return NextResponse.redirect(new URL("/", req.url));
    }
    console.log("✅ Veterinario autenticado - Permitiendo acceso");
  }

  // Rutas de cliente (agendar-cita, mis-citas) solo para dueños
  if (
    pathname.startsWith("/agendar-cita") ||
    pathname.startsWith("/mis-citas")
  ) {
    if (token && token.role === "veterinario") {
      console.log(
        "❌ Veterinario intentando acceder a ruta de cliente - Redirigiendo a dashboard"
      );
      return NextResponse.redirect(new URL("/veterinario/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
