import { NextRequest } from 'next/server';
import loadAuthFromCookie from '@/utils/pocketbase/server';

export async function GET(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  try {
    const record = await pb.collection('users').getOne(pb.authStore.model?.id);

    return new Response(JSON.stringify(record.settings ?? {}), { status: 200 });
  } catch (e) {
    console.error(`Failed GET /settings:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  const settings = await request.json();
  try {
    let res = await pb
      .collection('users')
      .update(pb.authStore.model?.id, { settings });
    return new Response(JSON.stringify(res));
  } catch (e) {
    console.error(`Failed POST /settings:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}
