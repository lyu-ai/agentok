import { useEffect } from 'react';
import { useRouter } from 'next/router';
import pb from '@/utils/pocketbase/client';

export const Redirect = ({
  searchParams: { code, state, provider },
}: {
  searchParams: { code: string; state: string; provider: string };
}) => {
  const local_prov = JSON.parse(localStorage.getItem('provider') as string);
  const router = useRouter();

  let redirectUrl = '/auth/redirect';
  useEffect(() => {
    const pbOauthLogin = async () => {
      pb.autoCancellation(false);
      const oauthRes = await pb
        .collection('devs')
        .authWithOAuth2(
          local_prov.name,
          code,
          local_prov.codeVerifier,
          redirectUrl
        );
      await pb.collection('devs').update(oauthRes?.record.id as string, {
        avatar: oauthRes.meta?.avatarUrl,
        accessToken: oauthRes.meta?.accessToken,
      });
      router.replace('/');
    };

    if (local_prov.state !== state) {
      const url = '/auth/login';
      if (typeof window !== 'undefined') {
        window.location.href = url;
      }
    } else {
      pbOauthLogin().catch(e => {
        console.log('error logging in with provider  == ', e);
      });
    }
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="loading loading-primary" />
    </div>
  );
};
