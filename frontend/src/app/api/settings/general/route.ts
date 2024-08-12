import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw new Error('Failed to authenticate');
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_settings')
      .select('general')
      .eq('user_id', user.id)
      .single();

    // Handle specific error code for no rows returned
    if (error) {
      if (error.code === 'PGRST116') {
        console.warn('User settings general not found');
        return NextResponse.json({});
      }
      throw error;
    }

    return NextResponse.json(data?.general ?? {});
  } catch (e) {
    console.error(`Failed GET /settings/general:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json();

    // Get the authenticated user
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error('Failed to authenticate');
    if (!authData.user) throw new Error('Not authenticated');

    const user = authData.user;

    // Fetch the existing settings
    const { data: existingSettings, error: settingsError } = await supabase
      .from('user_settings')
      .select('id, general')
      .eq('user_id', user.id)
      .maybeSingle();

    console.log('existingSettings:', existingSettings);

    if (settingsError) throw settingsError;

    // Merge existing settings with new settings
    const mergedSettings = {
      ...(existingSettings?.general ?? {}), // existing settings
      ...settings, // new settings
    };

    console.log('mergedSettings:', mergedSettings);

    let data, error;

    if (existingSettings) {
      // Update existing settings
      ({ data, error } = await supabase
        .from('user_settings')
        .update({ general: mergedSettings })
        .eq('id', existingSettings.id)
        .select('*')
        .single());
    } else {
      // Insert new settings
      ({ data, error } = await supabase
        .from('user_settings')
        .insert({ user_id: user.id, general: mergedSettings })
        .select('*')
        .single());
    }

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    console.error('Failed POST /settings:', (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
