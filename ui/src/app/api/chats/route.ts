import { NextRequest } from 'next/server';
import loadAuthFromCookie from '@/utils/pocketbase/server';

export async function GET(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  try {
    const chats = await pb
      .collection('chats')
      .getFullList({ sort: '-created' });
    return new Response(JSON.stringify(chats));
  } catch (e) {
    console.error(`Failed GET /chats:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  const chat = await request.json();
  try {
    const res = await pb.collection('chats').create(chat);
    return new Response(JSON.stringify(res));
  } catch (e) {
    console.error(`Failed POST /chats:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}
