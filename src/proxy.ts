import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminDashboard = pathname.startsWith('/admin/dashboard');
  const isAdminLogin = pathname === '/admin/login';
  const isAdminRoot = pathname === '/admin';
  const token = request.cookies.get('admin_token')?.value;

  // Protect dashboard
  if (isAdminDashboard && token !== 'authenticated') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Redirect to dashboard if already logged in and visiting login or root admin
  if ((isAdminLogin || isAdminRoot) && token === 'authenticated') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
