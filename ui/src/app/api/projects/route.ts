import { NextRequest, NextResponse } from 'next/server';
import { createClient, getSupabaseSession } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(projects);
  } catch (e) {
    console.error(`Failed GET /projects:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const project = await request.json();

    // Use upsert to handle both insert and update
    if (project.id === -1) {
      delete project.id;
    }
    const { data, error } = await supabase
      .from('projects')
      .upsert(project);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /projects:`, JSON.stringify((e as Error).message));
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}