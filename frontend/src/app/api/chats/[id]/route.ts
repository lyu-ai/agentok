import { NextRequest } from 'next/server';
import loadAuthFromCookie from '@/utils/pocketbase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pb = await loadAuthFromCookie();
    const chat = await pb.collection('chats').getOne(params.id);
    return new Response(JSON.stringify(chat));
  } catch (e) {
    console.error(`Failed GET /chats/${params.id}: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const chat = await request.json();
  try {
    const pb = loadAuthFromCookie();
    const res = (await pb).collection('chats').update(params.id, chat);
    return new Response(JSON.stringify(res));
  } catch (e) {
    console.error(`Failed POST /chats/${params.id}: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pb = await loadAuthFromCookie();
    const res = await pb.collection('chats').delete(params.id);
    return new Response(JSON.stringify({ result: res }));
  } catch (e) {
    console.error(`Failed DELETE /chats/${params.id}: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}
