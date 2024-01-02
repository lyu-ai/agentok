import loadAuthFromCookie from '@/utils/pocketbase/server';
import { NextRequest } from 'next/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:5004';

export async function GET(request: NextRequest) {
  const pb = await loadAuthFromCookie();

  const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/agents/extension`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pb.authStore.token}`,
    },
  });
  if (!res.ok) {
    console.error('GET /agents Error', await res.text());
    return new Response(res.statusText, { status: res.status });
  }
  const agents = await res.json();
  return new Response(JSON.stringify(agents));
}
