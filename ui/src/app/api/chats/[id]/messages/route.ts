import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { match } from 'path-to-regexp';

const locales = ['en', 'zh']; // Add all your supported locales here

// Create matchers for various path patterns
const loginMatcher = match('/:locale?/login');
const authMatcher = match('/:locale?/auth(.*)');
const localeMatcher = match('/:locale(en|zh)(.*)');

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Check if the path is a login or auth path
  const isLoginPath = loginMatcher(pathname);
  const isAuthPath = authMatcher(pathname);

  if (!user && !isLoginPath && !isAuthPath) {
    // Redirect to login page, preserving the current locale if present
    const url = request.nextUrl.clone();
    const localeMatch = localeMatcher(pathname);
    const currentLocale = localeMatch ? localeMatch.params.locale : '';
    url.pathname = currentLocale ? `/${currentLocale}/login` : '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}