import { NextRequest } from 'next/server';
import loadAuthFromCookie from '@/utils/pocketbase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pb = await loadAuthFromCookie();
    const project = await pb.collection('projects').getOne(params.id);
    return new Response(JSON.stringify(project));
  } catch (e) {
    console.error(`Failed GET /projects/${params.id}: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const project = await request.json();
  try {
    const pb = await loadAuthFromCookie();
    const res = await pb.collection('projects').update(params.id, project);
    return new Response(JSON.stringify(res));
  } catch (e) {
    console.error(`Failed POST /projects/${params.id}: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pb = await loadAuthFromCookie();
    const res = await pb.collection('projects').delete(params.id);
    return new Response(JSON.stringify({ result: res }));
  } catch (e) {
    console.error(`Failed DELETE /projects/${params.id}: ${e}`);
    return new Response((e as any).message, { status: 400 });
  }
}
