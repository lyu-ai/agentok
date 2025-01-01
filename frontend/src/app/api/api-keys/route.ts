import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseSession } from '@/lib/supabase/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004';

export async function GET(request: NextRequest) {
  try {
    const session = await getSupabaseSession();

    if (!session || !session.access_token) {
      throw new Error('No session or access token found');
    }

    const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/v1/admin/api-keys`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const apiKeys = await res.json();
    return NextResponse.json(apiKeys);
  } catch (e) {
    console.error(`Failed GET /api-keys:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSupabaseSession();
    const data = await request.json();
    console.log('POST /api-keys data', data);

    const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/v1/admin/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const newApiKey = await res.json();
    return NextResponse.json(newApiKey);
  } catch (e) {
    console.error(`Failed POST /api-keys:`, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
