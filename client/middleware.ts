import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get('token')?.value
  
  // Get the current path
  const { pathname } = request.nextUrl
  
  // Define auth pages
  const isAuthPage = pathname === '/login' || pathname === '/signup'
  
  // If user is on an auth page and is already authenticated
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If user is trying to access protected routes and is not authenticated
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

// Update matcher to be more specific
export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/login',
    '/signup'
  ]
} 