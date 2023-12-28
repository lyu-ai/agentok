import { NextRequest } from 'next/server';
import loadAuthFromCookie from '@/utils/pocketbase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pb = await loadAuthFromCookie();
    const flow = await pb.collection('flows').getOne(params.id);
    return new Response(JSON.stringify(flow));
  } catch (e) {
    console.error(`Failed GET /flows/${params.id}: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const flow = await request.json();
  try {
    const pb = await loadAuthFromCookie();
    console.log(`POST /flows/${params.id}`, flow);
    const res = await pb.collection('flows').update(params.id, flow);
    return new Response(JSON.stringify(res));
  } catch (e) {
    console.error(`Failed POST /flows/${params.id}: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pb = await loadAuthFromCookie();
    const res = await pb.collection('flows').delete(params.id);
    return new Response(JSON.stringify({ result: res }));
  } catch (e) {
    console.error(`Failed DELETE /flows/${params.id}: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}
