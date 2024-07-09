import { NextRequest } from 'next/server';
import loadAuthFromCookie from '@/utils/pocketbase/server';

export async function GET(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  let templates = await pb
    .collection('templates')
    .getFullList({ sort: '-created', expand: 'owner' });

  return new Response(JSON.stringify(templates));
}

export async function POST(request: NextRequest) {
  const template = await request.json();
  const pb = await loadAuthFromCookie();
  const templateWithOwner = {
    ...template,
    owner: pb.authStore.model?.id,
  };
  const res = await pb.collection('templates').create(templateWithOwner);
  if (!res) {
    console.error(`Failed POST /templates:`, templateWithOwner);
    return new Response(`Failed POST /templates: ${templateWithOwner.id}`, {
      status: 400,
    });
  }
  return new Response(JSON.stringify(res));
}
