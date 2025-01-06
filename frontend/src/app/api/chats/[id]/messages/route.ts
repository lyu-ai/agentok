import { NextRequest, NextResponse } from 'next/server';
import { createClient, getUser, getSession } from '@/lib/supabase/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', parseInt(id, 10))
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed GET /chats/${id}/messages:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();
  try {
    const user = await getUser();
    const {
      data: { session },
    } = await getSession();
    if (!session || !session.access_token) {
      throw new Error('No session or access token found');
    }
    console.log(`POST /chats/${id}/messages data`, data);
    data.user_id = user?.id;
    const res = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}/v1/chats/${id}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(data),
      }
    );
    const chat = await res.json();
    return new Response(JSON.stringify(chat));
  } catch (e) {
    console.error(`Failed POST /chats/${id}/messages:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('chat_messages')
    .delete()
    .eq('chat_id', parseInt(id, 10));
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed DELETE /chats/${id}/messages:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}
