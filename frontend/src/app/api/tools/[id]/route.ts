import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw new Error('Failed to authenticate');
    if (!user) throw new Error('Not authenticated');

    const { data: tool, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return NextResponse.json(tool);
  } catch (e) {
    console.error(`Failed GET /tools/${id}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw new Error('Failed to authenticate');
    if (!user) throw new Error('Not authenticated');
    const tool = await request.json();
    const toolWithOwner = {
      ...tool,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('tools')
      .update(toolWithOwner)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /tools/${id}: ${JSON.stringify(e)}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw new Error('Failed to authenticate');
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(`Failed DELETE /tools/${id}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
