import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'experimental-edge';

export async function proxy(request: NextRequest) {
  const isAdminDashboard = request.nextUrl.pathname.startsWith('/admin/dashboard');
  const token = request.cookies.get('admin_token')?.value;

  if (isAdminDashboard && token !== 'authenticated') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
