import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { datasetId: string } }
) {
  try {
    const datasetId = parseInt(params.datasetId, 10);
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error('Failed to authenticate');
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', datasetId)
      .eq('user_id', user.id)
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
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error('Failed to authenticate');
    if (!user) throw new Error('Not authenticated');
    const dataset = await request.json();

    console.log('POST /datasets', datasetId, dataset);

    const { data, error } = await supabase
      .from('datasets')
      .update(dataset)
      .eq('id', datasetId)
      .eq('user_id', user.id)
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
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error('Failed to authenticate');
    if (!user) throw new Error('Not authenticated');
    const datasetId = parseInt(params.datasetId, 10);

    const { error } = await supabase
      .from('datasets')
      .delete()
      .eq('id', datasetId)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ result: 'success' });
  } catch (e) {
    console.error(`Failed DELETE /datasets/${params.datasetId}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}