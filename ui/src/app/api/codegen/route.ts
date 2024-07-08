import loadAuthFromCookie from '@/utils/pocketbase/server';
import { NextRequest } from 'next/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004';

export async function POST(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  const data = await request.json();
  const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/dev/codegen`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pb.authStore.token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    console.warn('Codegen failed:', res.status, res.statusText, json);
  }
  return new Response(JSON.stringify(json), { status: res.status });
}
