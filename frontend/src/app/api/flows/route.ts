import { NextRequest } from 'next/server';

const FLOWGEN_SERVER_URL =
  process.env.FLOWGEN_SERVER_URL || 'https://flowgen.lyu.ai';

export async function GET(request: NextRequest) {
  const res = await fetch(`${FLOWGEN_SERVER_URL}/api/flows`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
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
  const flow = await request.json();
  const res = await fetch(`${FLOWGEN_SERVER_URL}/api/flows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
