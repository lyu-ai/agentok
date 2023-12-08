'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/utils/supabase/database.types';
import { Auth } from '@supabase/auth-ui-react';
import { SocialLayout, ThemeSupa, ViewType } from '@supabase/auth-ui-shared';
import styles from './page.module.css';
import { useState } from 'react';

const Page = () => {
  const supabase = createClientComponentClient<Database>();

  const classes: { [key: string]: string } = {
    'rgb(202, 37, 37)': styles['container-redshadow'],
    'rgb(65, 163, 35)': styles['container-greenshadow'],
    'rgb(8, 107, 177)': styles['container-blueshadow'],
    'rgb(235, 115, 29)': styles['container-orangeshadow'],
  };

  const colors = [
    'rgb(202, 37, 37)',
    'rgb(65, 163, 35)',
    'rgb(8, 107, 177)',
    'rgb(235, 115, 29)',
  ] as const;

  const socialAlignments = ['horizontal', 'vertical'] as const;

  const radii = ['5px', '10px', '20px'] as const;

  const views: { id: ViewType; title: string }[] = [
    { id: 'sign_in', title: 'Sign In' },
    { id: 'sign_up', title: 'Sign Up' },
    { id: 'magic_link', title: 'Magic Link' },
    { id: 'forgotten_password', title: 'Forgotten Password' },
    { id: 'update_password', title: 'Update Password' },
    { id: 'verify_otp', title: 'Verify Otp' },
  ];

  const [brandColor, setBrandColor] = useState(colors[0] as string)
  const [borderRadius, setBorderRadius] = useState(radii[0] as string)
  const [theme, setTheme] = useState('dark')
  const [socialLayout, setSocialLayout] = useState<SocialLayout>(socialAlignments[0] satisfies SocialLayout)
  const [view, setView] = useState(views[0])

  return (
    <div className="flex w-full h-full items-center justify-center">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          style: {
            button: {
              borderRadius: borderRadius,
              borderColor: 'rgba(0,0,0,0)',
            },
          },
          variables: {
            default: {
              colors: {
                brand: brandColor,
                brandAccent: `gray`,
              },
            },
          }
        }}
        providers={['github', 'google', 'twitter']}
        socialLayout={socialLayout}
        theme={theme}
        view={view.id}
      />
    </div>
  );
};

export default Page;
