'use client';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/utils/supabase/database.types';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const Page = () => {
  console.log(
    'process.env.NEXT_PUBLIC_SUPABASE_URL:',
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );

  return (
    <div className="flex w-full h-full items-center justify-center">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          style: {
            button: {
              borderRadius: '5px',
            },
            container: {
              minWidth: '320px',
            },
          },
          variables: {
            default: {
              colors: {
                brand: 'oklch(var(--p))',
              },
            },
          },
        }}
        providers={['google', 'twitter', 'github']}
        socialLayout={'horizontal'}
        theme={'dark'}
      />
    </div>
  );
};

export default Page;
