import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string; datasetId: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const projectId = parseInt(params.projectId, 10);
    const datasetId = parseInt(params.datasetId, 10);

    const { data: project, error } = await supabase
      .from('documents')
      .select('*')
      .eq('project_id', projectId)
      .eq('dataset_id', datasetId)
      .single();

    if (error) throw error;

    return NextResponse.json(project);
  } catch (e) {
    console.error(`Failed GET /projects/${params.projectId}/datasets: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string; datasetId: string } }
) {
  try {
    const session = await getSupabaseSession(); // Ensure user is authenticated
    const formData = await request.formData();
    const projectId = parseInt(params.projectId, 10);
    const datasetId = parseInt(params.datasetId, 10);

    console.log(`POST /projects/${projectId}/datasets/${datasetId}/documents`, formData);

    const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/v1/datasets/${datasetId}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || 'Failed to upload document');
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /projects/${params.projectId}/datasets/${params.datasetId}/documents: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
