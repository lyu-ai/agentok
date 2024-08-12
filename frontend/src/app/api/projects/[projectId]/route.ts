import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';
import { parse } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.projectId)
      .single();

    if (error) throw error;

    return NextResponse.json(project);
  } catch (e) {
    console.error(`Failed GET /projects/${params.projectId}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const projectId = parseInt(params.projectId, 10);
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const project = await request.json();

    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /projects/${params.projectId}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.projectId);

    if (error) throw error;

    return NextResponse.json({ result: 'success' });
  } catch (e) {
    console.error(`Failed DELETE /projects/${params.projectId}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
