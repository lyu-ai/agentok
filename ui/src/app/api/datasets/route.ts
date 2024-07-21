import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const projectId = parseInt(params.projectId, 10);

    const { data: dataset, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('project_id', projectId);

    console.log('GET /datasets', projectId, dataset);

    if (error) throw error;

    return NextResponse.json(dataset);
  } catch (e) {
    console.error(`Failed GET /projects/${params.projectId}/datasets: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const dataset = await request.json();
    const projectId = parseInt(params.projectId, 10);

    console.log(`POST /projects/${projectId}/datasets`, dataset);

    const { data, error } = await supabase
      .from('datasets')
      .insert(dataset);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /projects/${params.projectId}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
