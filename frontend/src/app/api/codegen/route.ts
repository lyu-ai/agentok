import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return NextResponse.json({ 
      error: 'Unauthorized',
      details: sessionError?.message 
    }, { status: 401 });
  }

  try {
    const data = await request.json();
    const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/v1/codegen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error('Codegen failed:', {
        status: res.status,
        statusText: res.statusText,
        error: json
      });
      
      return NextResponse.json({
        error: json.error || json.message || res.statusText,
        details: json,
        status: res.status
      }, { status: res.status });
    }

    return NextResponse.json(json);
  } catch (e) {
    console.error('Codegen error:', e);
    
    return NextResponse.json({
      error: 'Internal Server Error',
      details: e instanceof Error ? {
        message: e.message,
        stack: e.stack
      } : String(e)
    }, { status: 500 });
  }
}
