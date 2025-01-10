import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('chat_logs')
    .delete()
    .eq('chat_id', parseInt(id, 10));
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    console.error(`Failed DELETE /chats/${id}/logs:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}
