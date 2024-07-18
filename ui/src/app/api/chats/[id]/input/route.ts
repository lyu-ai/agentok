import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  // Get the authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let message = await request.json();
  message = {
    ...message,
    user_id: user.id,
    chat: params.id,
  };

  try {
    // Insert the new message
    const { data: newMessage, error: insertError } = await supabase
      .from('chat_messages')
      .insert(message)
      .select()
      .single();

    if (insertError) throw insertError;

    // Here, you would typically add the logic that was previously on your backend
    // For example, processing the message, generating a response, etc.
    // This is a placeholder for that logic:
    const processedMessage = await processMessage(newMessage, supabase);

    return NextResponse.json(processedMessage);
  } catch (e) {
    console.error('Error', e);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

// This function is a placeholder for the logic that was previously on your backend
async function processMessage(message: any, supabase: any) {
  // Implement your message processing logic here
  // This might involve:
  // 1. Analyzing the message
  // 2. Generating a response
  // 3. Inserting the response into the database
  // 4. Returning the processed message and response

  // For now, we'll just return the original message
  return message;
}