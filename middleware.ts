import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/dashboard', '/campaigns', '/query', '/stations', '/upload', '/api']
const PASSWORD = 'adverify2026'
const COOKIE_NAME = 'av_auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const auth = request.cookies.get(COOKIE_NAME)?.value
  if (auth === PASSWORD) return NextResponse.next()

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
