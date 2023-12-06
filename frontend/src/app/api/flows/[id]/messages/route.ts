import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

const FLOWGEN_SERVER_URL =
  process.env.FLOWGEN_SERVER_URL || 'https://flowgen.lyu.ai';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const messages = await supabase
    .from('messages')
    .select()
    .eq('session', params.id)
    .order('created_at', { ascending: false })
    .limit(50)
    .then(response => {
      // Assuming response.data contains the array of messages
      if (response.data) {
        // Reverse the array to get the oldest messages at the top
        return response.data.reverse();
      } else {
        // Handle no data or error condition
        return [];
      }
    });
  return new Response(JSON.stringify(messages));
}

export async function POST(request: NextRequest) {
  const message = await request.json();
  const res = await fetch(`${FLOWGEN_SERVER_URL}/api/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  if (!res.ok) {
    console.error('Error', await res.text());
    return new Response(res.statusText, { status: res.status });
  }
  const messages = await res.json();
  return new Response(JSON.stringify(messages));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  // Delete all messages
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('session', params.id);
  if (error) {
    console.error('Error', error);
    return new Response(JSON.stringify(error), { status: 400 });
  }
  let message = 'Deleted ';
  return new Response(message, { status: 200 });
}
