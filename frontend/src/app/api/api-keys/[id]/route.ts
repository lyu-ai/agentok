import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/supabase/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const {
      data: { session },
    } = await getSession();
    if (!session || !session.access_token) {
      throw new Error('No session or access token found');
    }

    const res = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}/v1/admin/api-keys/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const deleted = await res.json();
    return NextResponse.json(deleted);
  } catch (e) {
    console.error(`Failed DELETE /api-keys/${id}:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
