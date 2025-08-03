import { NextResponse } from 'next/server';

export function middleware(request) {
  // Only apply to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // This middleware will be used to parse form data
    // The actual parsing will be handled by the API routes
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}; 