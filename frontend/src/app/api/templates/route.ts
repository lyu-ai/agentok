import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: templates, error } = await supabase
      .from('public_templates')
      .select(`*`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(templates);
  } catch (e) {
    console.error(`Failed GET /templates:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const session = await getSupabaseSession();

    const template = await request.json();
    const templateWithOwner = {
      ...template,
      user_id: session.user.id,
    };

    const { data, error } = await supabase
      .from('templates')
      .insert(templateWithOwner)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /templates:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
