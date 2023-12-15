import { NextRequest } from 'next/server';
import loadAuthFromCookie from '@/utils/pocketbase/server';

const FLOWGEN_SERVER_URL =
  process.env.FLOWGEN_SERVER_URL || 'https://localhost:5004';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const pb = await loadAuthFromCookie();
  try {
    const record = await pb
      .collection('messages')
      .getList(1, 50, { filter: `chat='${params.id}'`, sort: '-created' });
    // .getFullList();
    return new Response(JSON.stringify(record.items));
  } catch (e) {
    console.error(`Failed GET /chats/${params.id}/messages: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const message = await request.json();
  const res = await fetch(`${FLOWGEN_SERVER_URL}/api/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  if (!res.ok) {
    console.error('Error', await res.text());
    return new Response(res.statusText, { status: res.status });
  }
  const messages = await res.json();
  return new Response(JSON.stringify(messages));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const pb = await loadAuthFromCookie();

  try {
    const messages = await pb
      .collection('messages')
      .getFullList({ filter: `chat='${params.id}'` });
    for (const message of messages) {
      await pb
        .collection('messages')
        .delete(message.id, { $autoCancel: false });
    }

    let message = 'Deleted ${messages.length} messages';
    return new Response(message, { status: 200 });
  } catch (e) {
    console.error(`Failed DELETE /chats/${params.id}/messages: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}
