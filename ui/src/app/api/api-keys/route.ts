import { NextRequest } from 'next/server';
import loadAuthFromCookie from '@/utils/pocketbase/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004';

export async function GET(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  try {
    const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/admin/api-keys`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pb.authStore.token}`,
      },
    });
    const chat = await res.json();
    return new Response(JSON.stringify(chat));
  } catch (e) {
    console.error(`Failed GET /api-keys:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}

type NewApiKeyParams = {
  name: string;
  expireSeconds: number;
};

type NewApiResponse = {
  token: string;
  token_sig: string;
  expire_at: number;
};

export async function POST(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  const data = await request.json();
  try {
    const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/admin/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pb.authStore.token}`,
      },
      body: JSON.stringify(data),
    });
    const chat = await res.json();
    return new Response(JSON.stringify(chat));
  } catch (e) {
    console.error(`Failed POST /api-keys:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}
