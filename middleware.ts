import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const token = req.auth;

  // Solo log en desarrollo
  if (process.env.NODE_ENV === "development") {
    console.log(
      "🔍 Middleware:",
      pathname,
      "Token:",
      !!token,
      "Role:",
      token?.user?.role
    );
  }

  return undefined; // Dejar que authConfig.callbacks.authorized maneje la lógica
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
