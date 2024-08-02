import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseSession } from '@/utils/supabase/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSupabaseSession();

    const res = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}/v1/admin/api-keys/${params.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const deleted = await res.json();
    return NextResponse.json(deleted);
  } catch (e) {
    console.error(`Failed DELETE /api-keys/${params.id}:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}