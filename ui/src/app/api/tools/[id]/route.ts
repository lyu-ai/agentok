import { NextRequest } from 'next/server';
import loadAuthFromCookie from '@/utils/pocketbase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pb = await loadAuthFromCookie();
    const tool = await pb.collection('tools').getOne(params.id);
    return new Response(JSON.stringify(tool));
  } catch (e) {
    console.error(`Failed GET /tools/${params.id}: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tool = await request.json();
  try {
    const pb = await loadAuthFromCookie();
    const res = await pb.collection('tools').update(params.id, tool);
    return new Response(JSON.stringify(res));
  } catch (e) {
    console.error(`Failed POST /tools/${params.id}: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pb = await loadAuthFromCookie();
    const res = await pb.collection('tools').delete(params.id);
    return new Response(JSON.stringify(res));
  } catch (e) {
    console.error(`Failed DELETE /tools/${params.id}: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}
