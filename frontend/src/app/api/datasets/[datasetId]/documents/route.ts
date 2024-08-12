import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004';

export async function GET(
  request: NextRequest,
  { params }: { params: { datasetId: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const datasetId = parseInt(params.datasetId, 10);

    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .order('id', { ascending: true })
      .eq('dataset_id', datasetId);

    if (error && error.code === 'PGRST116') {
      return NextResponse.json([]);
    }

    console.log(`GET /datasets/${params.datasetId}/documents`, documents);

    if (error) throw error;

    return NextResponse.json(documents);
  } catch (e) {
    console.error(
      `Failed GET /datasets/${params.datasetId}/documents: ${JSON.stringify(e)}`
    );
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { datasetId: string } }
) {
  try {
    const session = await getSupabaseSession(); // Ensure user is authenticated
    const formData = await request.formData();
    const datasetId = parseInt(params.datasetId, 10);

    console.log(`POST /datasets/${datasetId}/documents`, formData);

    const res = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}/v1/datasets/${datasetId}/documents`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || 'Failed to upload document');
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error(
      `Failed POST /datasets/${params.datasetId}/documents: ${JSON.stringify(
        e
      )}`
    );
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
