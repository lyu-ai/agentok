import { NextRequest } from 'next/server';

const FLOWGEN_SERVER_URL =
  process.env.FLOWGEN_SERVER_URL || 'https://flowgen.lyu.ai';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const res = await fetch(`${FLOWGEN_SERVER_URL}/api/codegen`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const code = await res.json();
  if (res.status !== 200) {
    console.warn('Codegen failed:', code);
  }
  return new Response(JSON.stringify(code), { status: res.status });
}
