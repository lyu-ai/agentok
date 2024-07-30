import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated

    const { data: dataset, error } = await supabase
      .from('datasets')
      .select('*');

    console.log('GET /datasets', dataset);

    if (error) throw error;

    return NextResponse.json(dataset);
  } catch (e) {
    console.error(`Failed GET /datasets: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const supabase = createClient();
    await getSupabaseSession(); // Ensure user is authenticated
    const dataset = await request.json();

    console.log(`POST /datasets`, dataset);

    const { data, error } = await supabase
      .from('datasets')
      .insert(dataset);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /datasets: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
