'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';

const providers = [
  { id: 'github', name: 'GitHub', icon: FaGithub },
  { id: 'google', name: 'Google', icon: FcGoogle },
  { id: 'twitter', name: 'X', icon: FaXTwitter },
];

const Login = ({
  searchParams: { redirectUrl },
}: {
  searchParams: { redirectUrl: string };
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const signIn = async (asGuest?: boolean) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: asGuest ? 'hi@flowgen.dev' : email,
      password: asGuest ? '123456' : password,
    });

    if (error) {
      setError(error.message);
    } else {
      setError('');
      router.push(redirectUrl ?? '/');
    }
  };

  const signInWithOAuth = async (provider: any) => {
    console.log(
      'redirect to:',
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
    );
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    console.log(provider, data, error);
  };

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    console.log('data:', data, error);

    if (error) {
      setError(error.message);
    } else {
      setError('');
    }
  };

  // for the `session` to be available on first SSR render, it must be
  // fetched in a Server Component and passed down as a prop
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <title>Sign In | FlowGen</title>
      <div className="flex flex-col gap-3">
        <div className="flex w-full items-center gap-2">
          {providers.map(({ id, name, icon: Icon }) => (
            <button
              className="flex-1 btn btn-outline bg-base-content/10 border-base-content/20"
              key={id}
              onClick={() => signInWithOAuth(id)}
              data-tooltip-content={`Sign in with ${name}`}
              data-tooltip-id="default-tooltip"
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        <div className="flex flex-col w-full justify-center border border-base-content/20 bg-base-content/10 rounded-md p-4 gap-2 text-foreground">
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="input input-bordered rounded py-2 bg-primary/20 mb-2"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="hi@flowgen.dev"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="input input-bordered rounded py-2 bg-primary/20 mb-2"
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="123456"
            required
          />
          {error && (
            <p className="p-2 text-error text-center w-full">{error}</p>
          )}
          <button className="btn btn-primary rounded" onClick={() => signIn()}>
            Sign In
          </button>
          <div className="mt-2 flex items-center justify-between text-sm">
            <button
              className="link link-hover link-primary"
              onClick={() => signUp()}
            >
              Sign up this Email
            </button>
            <button
              className="link link-hover link-primary"
              onClick={() => signIn(true)}
            >
              Sign in as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
