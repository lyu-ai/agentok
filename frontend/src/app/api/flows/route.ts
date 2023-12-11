import { NextRequest } from 'next/server';

const FLOWGEN_SERVER_URL =
  process.env.FLOWGEN_SERVER_URL || 'http://127.0.0.1:5004';

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization');
  const res = await fetch(`${FLOWGEN_SERVER_URL}/api/flows`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ?? '',
    },
  });
  if (!res.ok) {
    console.error(`Failed GET /flows:`, res.status, res.statusText);
    return new Response(res.statusText, { status: res.status });
  }
  const data = await res.json();
  return new Response(JSON.stringify(data));
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization');
  const flow = await request.json();
  const res = await fetch(`${FLOWGEN_SERVER_URL}/api/flows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ?? '',
    },
    body: JSON.stringify(flow),
  });
  if (!res.ok) {
    console.error(`Failed POST /flows:`, res.status, res.statusText);
    return new Response(res.statusText, { status: res.status });
  }
  const data = await res.json();
  return new Response(JSON.stringify(data));
}
