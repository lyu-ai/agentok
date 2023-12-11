import { NextRequest } from 'next/server';

const FLOWGEN_SERVER_URL =
  process.env.FLOWGEN_SERVER_URL || 'http://127.0.0.1:5004';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get('Authorization');

  const res = await fetch(`${FLOWGEN_SERVER_URL}/api/flows/${params.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ?? '',
    },
  });
  if (!res.ok) {
    console.error(
      `Failed GET /flows/${params.id}:`,
      res.status,
      res.statusText
    );
    return new Response(res.statusText, { status: res.status });
  }
  const data = await res.json();
  return new Response(JSON.stringify(data));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get('Authorization');

  const res = await fetch(`${FLOWGEN_SERVER_URL}/api/flows/${params.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ?? '',
    },
  });
  if (!res.ok) {
    console.error(
      `Failed DELETE /flows/${params.id}:`,
      res.status,
      res.statusText
    );
    return new Response(res.statusText, { status: res.status });
  }
  const data = await res.json();
  return new Response(JSON.stringify(data));
}
