import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: tools, error } = await supabase
      .from('public_tools')
      .select(`*`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(tools);
  } catch (e) {
    console.error(`Failed GET /tools:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
