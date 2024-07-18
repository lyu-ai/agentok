import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:5004';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  // Get the session from Supabase
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}/chats/${params.id}/abort`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error', errorText);
      return NextResponse.json({ error: res.statusText }, { status: res.status });
    }

    const messages = await res.json();
    return NextResponse.json(messages);
  } catch (e) {
    console.error('Error', e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}