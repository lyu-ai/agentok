import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed GET /chats/${id}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const chat = await request.json();
  try {
    const { data, error } = await supabase
      .from('chats')
      .update(chat)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /chats/${id}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  try {
    const chatId = parseInt(id, 10);
    const { error } = await supabase.from('chats').delete().eq('id', chatId);

    if (error?.code === 'PGRST004') {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    if (error) {
      console.warn(`Failed DELETE /chats/${id}:`, error);
      throw error;
    }
    return NextResponse.json({ result: 'success' });
  } catch (e) {
    console.error(`Failed DELETE /chats/${id}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
