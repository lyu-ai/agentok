import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { datasetId: string; documentId: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const datasetId = parseInt(params.datasetId, 10);
    const documentId = parseInt(params.documentId, 10);

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('dataset_id', datasetId)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(
      `Failed GET /datasets/${params.datasetId}/documents/${params.documentId}: ${e}`
    );
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { datasetId: string; documentId: string } }
) {
  const datasetId = parseInt(params.datasetId, 10);
  const documentId = parseInt(params.documentId, 10);
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const document = await request.json();

    console.log(
      `POST /datasets/${datasetId}/documents/${documentId}`,
      document
    );

    const { data, error } = await supabase
      .from('documents')
      .update(document)
      .eq('id', documentId)
      .eq('dataset_id', datasetId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(
      `Failed POST /datasets/${params.datasetId}/documents/${params.documentId}: ${e}`
    );
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { datasetId: string; documentId: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const datasetId = parseInt(params.datasetId, 10);
    const documentId = parseInt(params.documentId, 10);

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)
      .eq('dataset_id', datasetId);

    if (error) throw error;

    return NextResponse.json({ result: 'success' });
  } catch (e) {
    console.error(
      `Failed DELETE /datasets/${params.datasetId}/documents/${params.documentId}: ${e}`
    );
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
