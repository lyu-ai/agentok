'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const signIn = async (asGuest?: boolean) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: asGuest ? 'guest@flowgen.app' : email,
      password: asGuest ? 'guest' : password,
    });

    if (error) {
      console.error('error:', error);
      setError(error.message);
    }
    router.refresh();
  };

  const signInWithGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });

    console.log('github:', data);
  };

  const signUp = async () => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    router.refresh();
  };

  // for the `session` to be available on first SSR render, it must be
  // fetched in a Server Component and passed down as a prop
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <div className="flex flex-col gap-2">
        <button
          className="btn btn-outline bg-black-600"
          onClick={signInWithGitHub}
        >
          <FaGithub className="w-5 h-5" />
          Sign In with GitHub
        </button>

        <div className="flex flex-col w-full justify-center border border-base-content/20 rounded-md p-4 gap-2 text-foreground">
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="input rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="guest@flowgen.app"
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
