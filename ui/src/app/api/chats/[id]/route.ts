import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed GET /chats/${params.id}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const chat = await request.json();
  try {
    const { data, error } = await supabase
      .from('chats')
      .update(chat)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /chats/${params.id}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ result: 'success' });
  } catch (e) {
    console.error(`Failed DELETE /chats/${params.id}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}