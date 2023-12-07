import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'zh'],

  // Used when no locale matches
  defaultLocale: 'en',
  localeDetection: false,
  localePrefix: 'as-needed',
});

// export const config = {
//   // Match only internationalized pathnames
//   matcher: ['/', '/(zh|en)/:path*'],
// };

// Notes:
// The default solution does not work for catch-all path at root like /[[...id]]/page.tsx
// So we switch from 'match-only' strategy to 'skip-all-but' strategy

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\.(?:png|ico|svg|jpeg|jpg|webp|md|cer)).*)'], // Matcher ignoring `/_next/` and `/api/`
};
