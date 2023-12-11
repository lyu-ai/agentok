import { NextRequest } from 'next/server';

const FLOWGEN_SERVER_URL =
  process.env.FLOWGEN_SERVER_URL || 'http://127.0.0.1:5004';

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization');
  const res = await fetch(`${FLOWGEN_SERVER_URL}/api/chats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ?? '',
    },
  });
  if (!res.ok) {
    console.error(`Failed GET /chats:`, res.status, res.statusText);
    return new Response(res.statusText, { status: res.status });
  }
  const data = await res.json();
  return new Response(JSON.stringify(data));
}
