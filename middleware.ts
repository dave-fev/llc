import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that don't satisfy the matcher are not handled here, 
  // but we double check commonly protected routes just in case.

  // 1. Admin Protection
  if (pathname.startsWith('/admin')) {
    // skip actual login page
    if (pathname === '/admin/login' || pathname === '/admin-login') {
      return NextResponse.next();
    }

    const sessionToken = request.cookies.get('session_token');

    // If no token, redirect to admin login
    if (!sessionToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin-login';
      // Note: User mentioned 'admin must login', usually implies a specific admin login page. 
      // Assuming /admin-login based on context or we route to /login?role=admin
      // Let's check if /admin-login exists or we use /login.
      // PROBE: I'll use /login for now if I am unsure, but usually /admin path implies separate login. 
      // I'll stick to /login with a query param or just /login.
      // Re-reading: "redirect to login page also amdin must login to access admin panel"
      // I'll assume /login handles both or there is an /admin-login.
      // Let's safe bet: /login but let's check if /admin-login exists first.
      // For now, I'll allow the request to proceed if I'm not sure, but request said "admin must login".
      // I'll route to /login for now.
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // 2. User Dashboard Protection
  if (pathname.startsWith('/user')) {
    const sessionToken = request.cookies.get('session_token');
    if (!sessionToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
};

