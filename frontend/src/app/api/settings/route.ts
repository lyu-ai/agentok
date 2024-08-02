import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error('Failed to authenticate');
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_settings')
      .select('settings')
      .eq('user_id', user.id)
      .single();

    // Handle specific error code for no rows returned
    if (error) {
      if (error.code === 'PGRST116') {
        console.warn('User settings not found');
        return NextResponse.json({});
      }
      throw error;
    }

    return NextResponse.json(data?.settings ?? {});
  } catch (e) {
    console.error(`Failed GET /settings:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const settings = await request.json();

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error('Failed to authenticate');
    if (!user) throw new Error('Not authenticated');

    // Use upsert to insert or update the user's settings
    const { data, error } = await supabase
      .from('users')
      .upsert({ user_id: user.id, settings }, { onConflict: 'user_id' }).select('*').single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /settings:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}