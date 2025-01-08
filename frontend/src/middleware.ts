import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { updateSession } from '@/utils/supabase/middleware';
import { createClient } from '@/lib/supabase/server';

const publicPaths = /^\/(?:auth|discover)(?:\/.*)?$/;
const publicMatcher = (pathname: string): boolean => {
  return publicPaths.test(pathname);
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const isPublicPath = publicMatcher(req.nextUrl.pathname) !== false;

  if (isPublicPath) {
    return res;
  }

  const supabase = await createClient();

  // Ensure user is authenticated
  const { data } = await supabase.auth.getSession();
  const session = data?.session;
  if (!session) {
    // Redirect to login page
    const url = req.nextUrl.clone();
    const redirect = req.nextUrl.pathname;
    url.pathname = `/auth/login`;
    url.searchParams.set('redirect', redirect);
    return NextResponse.redirect(url);
  }

  return res;
}

// export const config = {
export const config = {
  // Skip all paths that should not be processed by middleware
  matcher: [
    '/projects/:path*',
    '/chats/:path*',
    '/tools/:path*',
    '/settings/:path*',
  ],
};
