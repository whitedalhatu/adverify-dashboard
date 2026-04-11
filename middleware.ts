import { NextRequest, NextResponse } from 'next/server'

const PROTECTED = ['/dashboard', '/campaigns', '/query', '/stations', '/upload']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!PROTECTED.some(p => pathname.startsWith(p))) return NextResponse.next()
  const auth = request.cookies.get('av_auth')?.value
  if (auth === 'granted') return NextResponse.next()
  const url = new URL('/login', request.url)
  url.searchParams.set('from', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|api).*)'],
}
