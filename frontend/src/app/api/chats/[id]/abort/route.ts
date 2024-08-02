import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:5004';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSupabaseSession();

  if (!session || !session.access_token) {
    throw new Error('No session or access token found');
  }

  try {
    const res = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}/v1/chats/${params.id}/abort`,
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