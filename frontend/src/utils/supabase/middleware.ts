import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { match } from 'path-to-regexp';

// Create a matcher function for authentication paths
const matchAuthPath = match<{ type: 'auth' | 'discover'; path: string }>(
  '/:type(auth|discover)/*'
);

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;
  const isAuthPath = matchAuthPath(pathname) !== false;

  console.log('session', session, pathname, isAuthPath);

  if (!session && isAuthPath) {
    // Redirect to login page, preserving the current locale if present
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
