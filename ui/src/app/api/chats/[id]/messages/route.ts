import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', parseInt(params.id, 10))
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed GET /chats/${params.id}/messages:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSupabaseSession();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const data = await request.json();
  try {
    console.log('POST /chats data', data);
    data.user_id = user?.id;
    const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/v1/chats/${params.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(data),
    });
    const chat = await res.json();
    return new Response(JSON.stringify(chat));
  } catch (e) {
    console.error(`Failed POST /chats/${params.id}/messages:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}
