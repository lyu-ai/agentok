import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
// import { updateSession } from '@/utils/supabase/middleware';
import { createClient } from '@/utils/supabase/server';
import { match } from 'path-to-regexp';

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localeDetection: false,
  localePrefix: 'as-needed',
});

const publicMatcher = match(['/auth/:path', '/discover/:path']);

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Apply intl middleware first
  const intlResult = intlMiddleware(req);
  // Merge headers from intl middleware into the Supabase response
  if (intlResult && intlResult.headers) {
    for (const [key, value] of intlResult.headers.entries()) {
      res.headers.set(key, value);
    }
  }

  if (publicMatcher(req.nextUrl.pathname)) {
    return res;
  }

  const supabase = createClient();

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
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\.(?:png|ico|svg|jpeg|jpg|webp|md|cer)).*)'], // Matcher ignoring `/_next/`, `/api/` and '/auth' routes; and all static assets
};
