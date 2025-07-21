import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });

  const url = req.nextUrl;
  const publicRoutes = ["/login", "/register"];
  const protectedRoutes = ["/admin", "/profile", "/dashboard"];
  const adminRoutes = ["/admin"];

  if (publicRoutes.includes(url.pathname)) {
    if (token) return NextResponse.redirect(new URL("/", req.url));
  } else if (protectedRoutes.includes(url.pathname)) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
  } else if (adminRoutes.includes(url.pathname)) {
    if (!token || token.role !== "ADMIN")
      return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
