import { NextRequest } from 'next/server';
import loadAuthFromCookie from '@/utils/pocketbase/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004';

export async function GET(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  try {
    const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/chats`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pb.authStore.token}`,
      },
    });
    if (!res.ok) {
      console.error(`Failed GET /chats:`, res.statusText);
      return new Response(`Failed GET /chats: ${res.statusText}`, {
        status: res.status,
      });
    }
    const chat = await res.json();
    return new Response(JSON.stringify(chat));
  } catch (e) {
    console.error(`Failed GET /chats:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  const data = await request.json();
  try {
    console.log('POST /chats data', data);
    const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/chats`, {
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
    console.error(`Failed POST /chats:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}
