import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string; datasetId: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const projectId = parseInt(params.projectId, 10);
    const datasetId = parseInt(params.datasetId, 10);

    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', datasetId)
      .eq('project_id', projectId)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed GET /projects/${params.projectId}/datasets/${params.datasetId}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string; datasetId: string } }
) {
  const projectId = parseInt(params.projectId, 10);
  const datasetId = parseInt(params.datasetId, 10);
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const dataset = await request.json();

    console.log('POST /datasets', projectId, datasetId, dataset);

    const { data, error } = await supabase
      .from('datasets')
      .update(dataset)
      .eq('id', datasetId)
      .eq('project_id', projectId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /projects/${params.projectId}/datasets/: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string; datasetId: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const projectId = parseInt(params.projectId, 10);
    const datasetId = parseInt(params.datasetId, 10);

    const { error } = await supabase
      .from('datasets')
      .delete()
      .eq('id', datasetId)
      .eq('project_id', projectId);

    if (error) throw error;

    return NextResponse.json({ result: 'success' });
  } catch (e) {
    console.error(`Failed DELETE /projects/${params.projectId}/datasets/${params.datasetId}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}