import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { documentId: string; chunkId: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const documentId = parseInt(params.documentId, 10);
    const chunkId = parseInt(params.chunkId, 10);

    const { data, error } = await supabase
      .from('chunks')
      .select('*')
      .eq('id', chunkId)
      .eq('document_id', documentId)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed GET /documents/${params.documentId}/chunks/${params.chunkId}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { documentId: string; chunkId: string } }
) {
  const documentId = parseInt(params.documentId, 10);
  const chunkId = parseInt(params.chunkId, 10);
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const chunk = await request.json();

    console.log(`POST /documents/${params.documentId}/chunks/${params.chunkId}`, chunk);

    const { data, error } = await supabase
      .from('chunks')
      .update(chunk)
      .eq('id', chunkId)
      .eq('document_id', documentId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed GET /documents/${params.documentId}/chunks/${params.chunkId}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { documentId: string; chunkId: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const documentId = parseInt(params.documentId, 10);
    const chunkId = parseInt(params.chunkId, 10);

    const { error } = await supabase
      .from('datasets')
      .delete()
      .eq('id', chunkId)
      .eq('document_id', documentId);

    if (error) throw error;

    return NextResponse.json({ result: 'success' });
  } catch (e) {
    console.error(`Failed DELETE /documents/${params.documentId}/chunks/${params.chunkId}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}