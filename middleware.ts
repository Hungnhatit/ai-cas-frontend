import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const publicRoutes = ["/", "/auth/login", "/auth/register", "/auth/forgot-password"]
  
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route))
  
  if (isPublicRoute) {
    return NextResponse.next()
  }
 
  return NextResponse.next()
}

export const config = {
  matcher: [
    // "/((?!api|_next/static|_next/image|favicon.ico).*)"
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/exam/:path*",
  ],
}
