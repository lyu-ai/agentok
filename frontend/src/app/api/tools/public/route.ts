import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error('Failed to authenticate');
    if (!user) throw new Error('Not authenticated');

    const { data: tools, error } = await supabase
      .from('tools')
      .select(`*`)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(tools);
  } catch (e) {
    console.error(`Failed GET /tools:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
