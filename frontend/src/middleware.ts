import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { createClient as createSupabaseClient } from '@/utils/supabase/middleware';

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
  const { supabase } = createSupabaseClient(req);
  // Get the session and if it sets any cookies or headers, apply those to the response
  const { data: session, error } = await supabase.auth.getSession();

  if (error) {
    // Handle the error according to your application's needs
    console.error('Supabase auth error:', error.message);
  }

  // If getSession sets cookies, apply those to the response
  if (session) {
    // Example of setting a cookie if getSession requires it
    // res.headers.append('Set-Cookie', session.cookieHeader);
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
  ], // Matcher ignoring `/_next/` and `/api/`
};
