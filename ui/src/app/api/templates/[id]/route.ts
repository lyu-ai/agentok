import { NextRequest } from 'next/server';
import loadAuthFromCookie from '@/utils/pocketbase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pb = await loadAuthFromCookie();
    const template = await pb.collection('templates').getOne(params.id);
    return new Response(JSON.stringify(template));
  } catch (e) {
    console.error(`Failed GET /templates/${params.id}: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const template = await request.json();
  try {
    const pb = await loadAuthFromCookie();
    const res = await pb.collection('templates').update(params.id, template);
    return new Response(JSON.stringify(res));
  } catch (e) {
    console.error(`Failed POST /templates/${params.id}: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pb = await loadAuthFromCookie();
    const res = await pb.collection('templates').delete(params.id);
    return new Response(JSON.stringify(res));
  } catch (e) {
    console.error(`Failed DELETE /templates/${params.id}: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}
