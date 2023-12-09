'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';

const Login = ({
  searchParams: { redirectedFrom },
}: {
  searchParams: { redirectedFrom: string };
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const signIn = async (asGuest?: boolean) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: asGuest ? 'guest@flowgen.dev' : email,
      password: asGuest ? 'guest' : password,
    });

    if (error) {
      console.error('error:', error);
      setError(error.message);
    } else {
      setError('');
      router.push(redirectedFrom ?? '/');
    }
  };

  const signInWithOAuth = async (provider: any) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
    });

    console.log(provider, data, error);
  };

  const signUp = async () => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  // for the `session` to be available on first SSR render, it must be
  // fetched in a Server Component and passed down as a prop
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <div className="flex flex-col gap-2">
        <div className="flex w-full items-center gap-2">
          <button
            className="flex-1 btn btn-outline border-base-content/20"
            onClick={() => signInWithOAuth('google')}
            data-tooltip-content={`Sign in with Google`}
            data-tooltip-id="default-tooltip"
          >
            <FcGoogle className="w-5 h-5" />
          </button>
          <button
            className="flex-1 btn btn-outline border-base-content/20"
            onClick={() => signInWithOAuth('twitter')}
            data-tooltip-content={`Sign in with X`}
            data-tooltip-id="default-tooltip"
          >
            <FaXTwitter className="w-5 h-5" />
          </button>
          <button
            className="flex-1 btn btn-outline bg-black-600 border-base-content/20"
            onClick={() => signInWithOAuth('github')}
            data-tooltip-content={`Sign in with GitHub`}
            data-tooltip-id="default-tooltip"
          >
            <FaGithub className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col w-full justify-center border border-base-content/20 rounded-md p-4 gap-2 text-foreground">
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="input rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="guest@flowgen.dev"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="input rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="guest"
            required
          />
          {error && (
            <p className="p-2 text-error text-center w-full">{error}</p>
          )}
          <button className="btn btn-primary" onClick={() => signIn()}>
            Sign In
          </button>
          <div className="flex items-center justify-between">
            <button className="link link-hover" onClick={signUp}>
              Sign Up
            </button>
            <button className="link link-hover" onClick={() => signIn(true)}>
              Login as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
