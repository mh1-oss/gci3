import { auth } from "./auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest & { auth: any }) => {
  const isLoggedin = !!req.auth;
  const { nextUrl } = req;

  const isDashboardRoute = nextUrl.pathname.startsWith("/admin/dashboard");
  const isLoginRoute = nextUrl.pathname === "/admin/login";

  if (isDashboardRoute && !isLoggedin) {
    return NextResponse.redirect(new URL("/admin/login", nextUrl));
  }

  if (isLoginRoute && isLoggedin) {
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/login"],
};
