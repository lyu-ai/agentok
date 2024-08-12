'use client';

import supabase from '@/utils/supabase/client';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { GoZap } from 'react-icons/go';
import { HiSparkles } from 'react-icons/hi2';

const providers = [
  { id: 'github', name: 'GitHub', icon: FaGithub },
  { id: 'google', name: 'Google', icon: FcGoogle },
];

const LoginToast = () => {
  const t = useTranslations('page.Login');
  return (
    <div className="fixed items-center justify-centre z-50">
      <div className="flex flex-col items-center justify-center p-4 gap-2 bg-base-content/50 backdrop-blur-md rounded-md">
        <HiSparkles className="w-6 h-6 text-primary animate-spin" />
        <span className="text-sm text-primary">{t('signing-in')}</span>
      </div>
    </div>
  );
};

const Login = ({
  searchParams: { redirect },
}: {
  searchParams: { redirect: string };
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [authenticating, setAuthenticating] = useState(false);
  const t = useTranslations('page.Login');

  const signIn = async (asGuest?: boolean) => {
    try {
      setAuthenticating(true);
      await supabase.auth.signInWithPassword({
        email: asGuest ? 'hi@agentok.ai' : email,
        password: asGuest ? '12345678' : password,
      });
      setError('');
      router.push(redirect ?? '/');
    } catch (e) {
      setError((e as any).message ?? `Sign in failed. ${e}`);
    } finally {
      setAuthenticating(false);
    }
  };

  const signInWithOAuth = async (provider: any) => {
    try {
      setAuthenticating(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect ?? '/')}`,
        },
      });
      if (error) throw error;
      router.push(redirect ?? '/');
    } catch (e) {
      console.error(error);
      setError(`Auth with ${provider} failed. ${e}`);
    } finally {
      setAuthenticating(false);
    }
  };

  const signUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setError('');
        // Optionally, you can add additional user data to a custom table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: data.user.id, email: data.user.email });

        if (profileError) throw profileError;

        // Handle successful sign up
        console.log('Sign up successful', data.user);
        // You might want to redirect the user or show a success message
      }
    } catch (e) {
      setError(`Sign up failed. ${(e as any).message}`);
    }
  };

  // for the `session` to be available on first SSR render, it must be
  // fetched in a Server Component and passed down as a prop
  return (
    <div className="flex-1 flex flex-col w-full items-center px-8 justify-center gap-2">
      <title>Sign In | Agentok Studio</title>
      <div className="flex flex-col gap-3 w-96">
        <div className="flex w-full items-center gap-2">
          {providers.map(({ id, name, icon: Icon }) => (
            <button
              className="flex-1 btn btn-outline bg-base-content/10 border-base-content/20"
              key={id}
              onClick={() => signInWithOAuth(id)}
              data-tooltip-content={t('sign-in-with', { provider: name })}
              data-tooltip-id="default-tooltip"
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        <form
          className="flex flex-col w-full justify-center border border-base-content/20 bg-base-content/10 rounded-md p-4 gap-2 text-foreground"
          onSubmit={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          <label className="text-md" htmlFor="email">
            {t('email')}
          </label>
          <input
            className="input input-bordered rounded py-2 bg-primary/20 mb-2"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('email-placeholder')}
            autoComplete="email"
            required
          />
          <label className="text-md" htmlFor="password">
            {t('password')}
          </label>
          <input
            className="input input-bordered rounded py-2 bg-primary/20 mb-2"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('password-placeholder')}
            autoComplete="current-password"
            required
          />
          {error && (
            <p className="p-2 text-error text-center w-full">{error}</p>
          )}
          <button className="btn btn-primary rounded" type="submit">
            {t('sign-in')}
          </button>
          <div className="mt-2 flex items-center justify-between text-sm">
            <button
              className="link link-hover link-primary"
              onClick={() => signUp()}
            >
              {t('sign-up-email')}
            </button>
            <button
              className="link link-hover link-primary flex items-center gap-1"
              onClick={() => signIn(true)}
            >
              <GoZap className="w-4 h-4" />
              {t('sign-in-as-guest')}
            </button>
          </div>
        </form>
      </div>
      {authenticating && <LoginToast />}
    </div>
  );
};

export default Login;
