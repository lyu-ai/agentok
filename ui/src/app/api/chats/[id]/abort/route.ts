import { NextRequest } from 'next/server';
import loadAuthFromCookie from '@/utils/pocketbase/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:5004';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const pb = await loadAuthFromCookie();

  const res = await fetch(
    `${NEXT_PUBLIC_BACKEND_URL}/chats/${params.id}/abort`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pb.authStore.token}`,
      },
    }
  );
  if (!res.ok) {
    console.error('Error', await res.text());
    return new Response(res.statusText, { status: res.status });
  }
  const messages = await res.json();
  return new Response(JSON.stringify(messages));
}
