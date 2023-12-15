import { NextRequest } from 'next/server';
import loadAuthFromCookie from '@/utils/pocketbase/server';

export async function GET(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  try {
    const flows = await pb.collection('flows').getFullList();
    return new Response(JSON.stringify(flows), { status: 200 });
  } catch (e) {
    console.error(`Failed GET /flows:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  console.log('POST /flows');
  const pb = await loadAuthFromCookie();
  const chat = await request.json();
  try {
    const res = await pb.collection('flows').create(chat);
    return new Response(JSON.stringify(res));
  } catch (e) {
    console.error(`Failed POST /flows:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}
