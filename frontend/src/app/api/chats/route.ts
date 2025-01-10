import { NextRequest, NextResponse } from 'next/server';
import { createClient, getUser } from '@/lib/supabase/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) throw new Error('Not authenticated');

    const { data: chats, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(chats);
  } catch (e) {
    console.error(`Failed GET /chats:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const chat = await request.json();

    // Use upsert to handle both insert and update
    if (chat.id === -1) {
      delete chat.id;
    }

    // Get the authenticated user
    const user = await getUser();
    if (!user) throw new Error('Not authenticated');

    chat.user_id = user.id;
    const { data, error } = await supabase
      .from('chats')
      .upsert(chat)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /chats:`, JSON.stringify((e as Error).message));
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
