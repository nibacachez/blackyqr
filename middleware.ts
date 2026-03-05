import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PROTECTED_PATHS.some(p => pathname.startsWith(p))) {
    // Basic protection: require session token cookie or Authorization header
    const hasAuthHeader = request.headers.get('authorization')?.startsWith('Bearer ');
    const hasCookie = request.cookies.has('sb-access-token') || request.cookies.has('supabase-auth-token') || request.cookies.has('next-auth.session-token');
    if (!hasAuthHeader && !hasCookie) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*', '/admin/:path*'] };
