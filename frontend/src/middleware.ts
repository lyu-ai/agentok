import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import loadAuthFromRequestCookie from './utils/pocketbase/middleware';

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

  const pb = loadAuthFromRequestCookie(req);
  if (!pb.authStore.isValid) {
    const redirectTo = req.nextUrl.pathname;
    return NextResponse.redirect(
      new URL(`/auth/login?redirect=${redirectTo}`, req.nextUrl)
    );
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
