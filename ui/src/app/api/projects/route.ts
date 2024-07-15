import { NextRequest } from 'next/server';
import loadAuthFromCookie from '@/utils/pocketbase/server';

export async function GET(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  try {
    const flows = await pb
      .collection('projects')
      .getFullList({ sort: '-created' });
    return new Response(JSON.stringify(flows), { status: 200 });
  } catch (e) {
    console.error(`Failed GET /projects:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const pb = await loadAuthFromCookie();
  const project = await request.json();
  try {
    let res;
    if (project.id && project.id !== '') {
      // empty string means new project
      res = await pb.collection('projects').update(project.id, project);
    } else {
      delete project.id;
      res = await pb.collection('projects').create(project);
    }
    return new Response(JSON.stringify(res));
  } catch (e) {
    console.error(`Failed POST /projects:`, (e as any).message);
    return new Response((e as any).message, { status: 400 });
  }
}
