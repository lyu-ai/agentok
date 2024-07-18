import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated

    const { data: tool, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;

    return NextResponse.json(tool);
  } catch (e) {
    console.error(`Failed GET /tools/${params.id}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const tool = await request.json();

    const { data, error } = await supabase
      .from('tools')
      .update(tool)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /tools/${params.id}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated

    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(`Failed DELETE /tools/${params.id}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}