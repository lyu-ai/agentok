import loadAuthFromCookie from '@/utils/pocketbase/server';
import { NextRequest } from 'next/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004';

export async function POST(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  const data = await request.json();
  const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/codegen`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pb.authStore.token}`,
    },
    body: JSON.stringify(data),
  });
  const code = await res.json();
  if (res.status !== 200) {
    console.warn('Codegen failed:', code);
  }
  return new Response(JSON.stringify(code), { status: res.status });
}
