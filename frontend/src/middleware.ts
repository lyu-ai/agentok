import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { createClient } from '@/utils/supabase/middleware';

// Create a middleware for internationalization
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localeDetection: false,
  localePrefix: 'as-needed',
});

// Middleware to handle both internationalization and Supabase authentication
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Process the internationalization middleware logic
  const intlResult = await intlMiddleware(req);
  if (intlResult) {
    for (const [key, value] of intlResult.headers.entries()) {
      res.headers.set(key, value);
    }
  }

  // Process the Supabase auth middleware logic
  const { supabase } = createClient(req);

  // Get the session and if it sets any cookies or headers, apply those to the response
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    // Handle the error according to your application's needs
    console.error('Supabase auth error:', error.message);
  }

  // `session` is `null`, redirect to login page
  if (!session) {
    const url = req.nextUrl.clone();
    console.log('url.pathname', url.pathname);
    // Define the public paths that don't require authentication
    const publicPaths = ['/login']; // Add publicly accessible paths here
    // Check if the current request path is not a public path
    if (!publicPaths.includes(url.pathname)) {
      // Redirect the user to the login page with a return URL
      url.pathname = '/login';
      url.searchParams.set('redirectedFrom', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // Now return the response after processing both middlewares
  return res;
}

// export const config = {
//   // Match only internationalized pathnames
//   matcher: ['/', '/(zh|en)/:path*'],
// };

// Notes:
// The default solution does not work for catch-all path at root like /[[...id]]/page.tsx
// So we switch from 'match-only' strategy to 'skip-all-but' strategy

export const config = {
  // Skip all paths that should not be internationalized
  matcher: [
    '/((?!api|_next|auth|.*\\.(?:png|ico|svg|jpeg|jpg|webp|md|cer)).*)',
  ], // Matcher ignoring `/_next/`, `/api/` and '/auth' routes; and all static assets
};
