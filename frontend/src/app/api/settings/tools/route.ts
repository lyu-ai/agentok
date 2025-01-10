import { NextRequest, NextResponse } from 'next/server';
import { createClient, getUser } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_settings')
      .select('tools')
      .eq('user_id', user.id)
      .single();

    console.log('user_settings.tools:', data);

    // Handle specific error code for no rows returned
    if (error) {
      if (error.code === 'PGRST116') {
        console.warn('User settings(tool) not found');
        return NextResponse.json({});
      }
      throw error;
    }

    return NextResponse.json(data?.tools ?? {});
  } catch (e) {
    console.error(`Failed GET /settings/tools:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json();

    // Get the authenticated user
    const supabase = await createClient();
    const user = await getUser();

    if (!user) throw new Error('Not authenticated');

    // Fetch the existing settings
    const { data: existingSettings, error: settingsError } = await supabase
      .from('user_settings')
      .select('id, tools')
      .eq('user_id', user.id)
      .maybeSingle();

    console.log('existingSettings:', existingSettings);

    if (settingsError) throw settingsError;

    // Merge existing settings with new settings
    const mergedSettings = {
      ...(existingSettings?.tools ?? {}), // existing settings
      ...settings, // new settings
    };

    console.log('mergedSettings:', mergedSettings);

    let data, error;

    if (existingSettings) {
      // Update existing settings
      ({ data, error } = await supabase
        .from('user_settings')
        .update({ tools: mergedSettings })
        .eq('id', existingSettings.id)
        .select('*')
        .single());
    } else {
      // Insert new settings
      ({ data, error } = await supabase
        .from('user_settings')
        .insert({ user_id: user.id, tools: mergedSettings })
        .select('*')
        .single());
    }

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error('Failed POST /settings/tools:', (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
