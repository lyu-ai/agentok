import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated

    const { data: template, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;

    return NextResponse.json(template);
  } catch (e) {
    console.error(`Failed GET /templates/${params.id}: ${e}`);
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
    const template = await request.json();

    const { data, error } = await supabase
      .from('templates')
      .update(template)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /templates/${params.id}: ${e}`);
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
      .from('templates')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(`Failed DELETE /templates/${params.id}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}