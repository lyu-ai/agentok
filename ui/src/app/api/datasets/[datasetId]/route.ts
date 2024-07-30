import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { datasetId: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const datasetId = parseInt(params.datasetId, 10);

    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', datasetId)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed GET /datasets/${params.datasetId}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { datasetId: string } }
) {
  const datasetId = parseInt(params.datasetId, 10);
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const dataset = await request.json();

    console.log('POST /datasets', datasetId, dataset);

    const { data, error } = await supabase
      .from('datasets')
      .update(dataset)
      .eq('id', datasetId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /datasets/: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { datasetId: string } }
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const datasetId = parseInt(params.datasetId, 10);

    const { error } = await supabase
      .from('datasets')
      .delete()
      .eq('id', datasetId);

    if (error) throw error;

    return NextResponse.json({ result: 'success' });
  } catch (e) {
    console.error(`Failed DELETE /datasets/${params.datasetId}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}