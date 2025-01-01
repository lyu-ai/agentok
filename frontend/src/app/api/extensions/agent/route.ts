import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:5004';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Get the session from Supabase
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/v1/extensions/agent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!res.ok) {
      console.error('GET /agents Error', await res.text());
      return NextResponse.json(
        { error: res.statusText },
        { status: res.status }
      );
    }

    const agents = await res.json();
    return NextResponse.json(agents);
  } catch (e) {
    console.error('Error:', e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
