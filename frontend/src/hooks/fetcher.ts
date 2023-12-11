import { createClient } from '@/utils/supabase/client';

export const fetcher = async (url: string) => {
  const supabase = createClient();
  const session = await supabase.auth.getSession();
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + session.data.session?.access_token,
    },
  });
  if (!response.ok) {
    throw new Error('Error fetching data');
  }
  return response.json();
};
