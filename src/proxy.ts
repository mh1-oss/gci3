import { auth } from "./auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const proxy = auth((req: NextRequest & { auth: any }) => {
  const isLoggedin = !!req.auth;
  const isAdmin = req.auth?.user?.role === "admin";
  const { nextUrl } = req;
  
  const isDashboardRoute = nextUrl.pathname.startsWith("/admin/dashboard");
  const isLoginRoute = nextUrl.pathname === "/admin/login";

  // Redirect to login if user is not logged in OR is not an admin when trying to access dashboard
  if (isDashboardRoute && (!isLoggedin || !isAdmin)) {
    return NextResponse.redirect(new URL("/admin/login", nextUrl));
  }

  // Redirect to dashboard if logged-in admin tries to access login page
  if (isLoginRoute && isLoggedin && isAdmin) {
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export default proxy;

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/login"],
};
