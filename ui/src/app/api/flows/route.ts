import { NextRequest } from 'next/server';
import loadAuthFromCookie from '@/utils/pocketbase/server';

export async function GET(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  try {
    const flows = await pb
      .collection('flows')
      .getFullList({ sort: '-created' });
    return new Response(JSON.stringify(flows), { status: 200 });
  } catch (e) {
    console.error(`Failed GET /flows:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  const flow = await request.json();
  try {
    let res;
    if (flow.id) {
      res = await pb.collection('flows').update(flow.id, flow);
    } else {
      res = await pb.collection('flows').create(flow);
    }
    return new Response(JSON.stringify(res));
  } catch (e) {
    console.error(`Failed POST /flows:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}
