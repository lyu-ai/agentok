import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/lib/supabase/server';
import { parse } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json(project);
  } catch (e) {
    console.error(`Failed GET /projects/${id}: ${e}`);
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
    await getSupabaseSession(); // Ensure user is authenticated
    const project = await request.json();

    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /projects/${id}: ${e}`);
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
    await getSupabaseSession(); // Ensure user is authenticated

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ result: 'success' });
  } catch (e) {
    console.error(`Failed DELETE /projects/${id}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
