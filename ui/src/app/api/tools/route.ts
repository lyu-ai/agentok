import { NextRequest } from 'next/server';
import loadAuthFromCookie from '@/utils/pocketbase/server';

export async function GET(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  let templates = await pb
    .collection('tools')
    .getFullList({ sort: '-created', expand: 'owner' });

  return new Response(JSON.stringify(templates));
}

export async function POST(request: NextRequest) {
  const template = await request.json();
  const pb = await loadAuthFromCookie();
  const toolWithOwner = {
    ...template,
    owner: pb.authStore.model?.id,
  };
  const res = await pb.collection('tools').create(toolWithOwner);
  if (!res) {
    console.error(`Failed POST /tools:`, toolWithOwner);
    return new Response(`Failed POST /tools: ${toolWithOwner.id}`, {
      status: 400,
    });
  }
  return new Response(JSON.stringify(res));
}
