import { NextRequest, NextResponse } from 'next/server';
import { createClient, getUser } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw new Error('Failed to authenticate', authError);
    if (!user) throw new Error('Not authenticated');

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(projects);
  } catch (e) {
    console.error(`Failed GET /projects:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const project = await request.json();

    // Use upsert to handle both insert and update
    if (project.id === -1) {
      delete project.id;
    }
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw new Error('Failed to authenticate', authError);
    if (!user) throw new Error('Not authenticated');

    project.user_id = user.id;

    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(
      `Failed POST /projects:`,
      JSON.stringify((e as Error).message)
    );
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
