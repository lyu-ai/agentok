import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004';

export async function GET(
  request: NextRequest,
  { params }: { params: { datasetId: string; documentId: string } }
) {
  try {
    const documentId = parseInt(params.documentId, 10);

    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw new Error('Failed to authenticate');
    if (!user) throw new Error('Not authenticated');

    const { data: chunks, error } = await supabase
      .from('chunks')
      .select('*')
      .order('chunk_index', { ascending: true })
      .eq('document_id', documentId)
      .eq('user_id', user.id);

    if (error && error.code === 'PGRST116') {
      return NextResponse.json([]);
    }
    if (error) throw error;

    return NextResponse.json(chunks);
  } catch (e) {
    console.error(
      `Failed GET /datasets/${params.datasetId}/documents/${
        params.documentId
      }/chunks: ${JSON.stringify(e)}`
    );
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { datasetId: string; documentId: string } }
) {
  try {
    const session = await getSupabaseSession(); // Ensure user is authenticated
    const formData = await request.formData();
    const datasetId = parseInt(params.datasetId, 10);
    const documentId = parseInt(params.documentId, 10);

    console.log(
      `POST /datasets/${datasetId}/documents/${documentId}/chunks`,
      formData
    );

    const res = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}/v1/datasets/${datasetId}/documents/${documentId}/chunks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      `Failed POST /datasets/${params.datasetId}/documents/${params.documentId}/chunks: ${e}`
    );
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
