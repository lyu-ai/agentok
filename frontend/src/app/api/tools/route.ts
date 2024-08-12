import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw new Error('Failed to authenticate');
    if (!user) throw new Error('Not authenticated');

    const { data: tools, error } = await supabase
      .from('tools')
      .select(`*`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(tools);
  } catch (e) {
    console.error(`Failed GET /tools:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
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
      .insert(toolWithOwner)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      throw new Error('Failed to create tool');
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /tools:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
