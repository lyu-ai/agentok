import loadAuthFromCookie from '@/utils/pocketbase/server';
import { NextRequest } from 'next/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const pb = await loadAuthFromCookie();
  try {
    const res = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}/admin/api-keys/${params.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pb.authStore.token}`,
        },
      }
    );
    const deleted = await res.json();
    return new Response(JSON.stringify(deleted));
  } catch (e) {
    console.error(`Failed DELETE /api-keys/${params.id}:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}
