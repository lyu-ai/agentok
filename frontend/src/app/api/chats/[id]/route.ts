import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get('Authorization');
  const res = await fetch(
    `${process.env.FLOWGEN_SERVER_URL}/api/chats/${params.id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ?? '',
      },
    }
  );
  if (!res.ok) {
    console.error(
      `Failed GET /chats/${params.id}:`,
      res.status,
      res.statusText
    );
    return new Response(res.statusText, { status: res.status });
  }
  const data = await res.json();
  return new Response(JSON.stringify(data));
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get('Authorization');
  const chat = await request.json();
  const res = await fetch(
    `${process.env.FLOWGEN_SERVER_URL}/api/chats/${params.id}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ?? '',
      },
      body: JSON.stringify(chat),
    }
  );
  if (!res.ok) {
    console.error(
      `Failed POST /chats/${params.id}:`,
      res.status,
      res.statusText,
      await res.text()
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
  const res = await fetch(
    `${process.env.FLOWGEN_SERVER_URL}/api/chats/${params.id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ?? '',
      },
    }
  );
  if (!res.ok) {
    console.error(
      `Failed DELETE /chats/${params.id}:`,
      res.status,
      res.statusText
    );
    return new Response(res.statusText, { status: res.status });
  }
  const data = await res.json();
  return new Response(JSON.stringify(data));
}
