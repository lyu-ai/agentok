import { NextRequest, NextResponse } from 'next/server';
import { createClient, getUser } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const user = await getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: tool, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return NextResponse.json(tool);
  } catch (e) {
    console.error(`Failed GET /tools/${id}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const user = await getUser();
    if (!user) throw new Error('Not authenticated');
    const tool = await request.json();
    const toolWithOwner = {
      ...tool,
      user_id: user.id,
    };

    // First check if the tool exists
    const { data: existingTool, error: checkError } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (checkError) throw checkError;
    if (!existingTool) throw new Error('Tool not found');
    console.log('existingTool', existingTool);

    // Then update the tool
    const { data, error } = await supabase
      .from('tools')
      .update(toolWithOwner)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update tool');

    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed POST /tools/${id}: ${JSON.stringify(e)}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(`Failed DELETE /tools/${id}: ${e}`);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
