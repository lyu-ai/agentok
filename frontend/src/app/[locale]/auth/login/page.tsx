'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast';
import supabase from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { Icons } from '@/components/icons';

const providers = [
  { id: 'github', name: 'GitHub', icon: Icons.github },
  { id: 'google', name: 'Google', icon: Icons.google },
];

const LoginToast = () => {
  const t = useTranslations('page.Login');
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center p-4 gap-2 bg-background/80 backdrop-blur-md rounded-md">
        <Icons.sparkles className="w-6 h-6 text-primary animate-spin" />
        <span className="text-sm text-primary">{t('signing-in')}</span>
      </div>
    </div>
  );
};

const Login = ({
  searchParams,
}: {
  searchParams: Promise<{ redirect: string }>;
}) => {
  const { redirect } = use(searchParams);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [authenticating, setAuthenticating] = useState(false);
  const t = useTranslations('page.Login');

  const signIn = async (asGuest?: boolean) => {
    if (asGuest) {
      setEmail('hi@agentok.ai');
      setPassword('12345678');
      // Ensure state is updated before calling signIn again
      setTimeout(async () => {
        await signIn();
      }, 0);
    } else if (email && password) {
      try {
        setAuthenticating(true);
        const res = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (res.error) throw res.error;
        setError('');
        router.push(redirect ?? '/');
      } catch (e) {
        setError((e as any).message ?? `Sign in failed. ${e}`);
      } finally {
        setAuthenticating(false);
      }
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
            <Button
              variant="outline"
              className="flex-1"
              key={id}
              onClick={() => signInWithOAuth(id)}
            >
              <Icon className="w-5 h-5" />
            </Button>
          ))}
        </div>

        <form
          className="flex flex-col w-full justify-center space-y-4 border rounded-lg p-4 bg-card"
          onSubmit={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email-placeholder')}
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password-placeholder')}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="text-destructive text-center">{error}</p>}

          <Button type="submit" className="w-full">
            {t('sign-in')}
          </Button>

          <div className="mt-2 flex items-center justify-between text-sm">
            <Button variant="link" className="p-0" onClick={() => signUp()}>
              {t('sign-up-email')}
            </Button>
            <Button
              variant="link"
              className="p-0 flex items-center gap-1"
              onClick={() => signIn(true)}
            >
              <Icons.zap className="w-4 h-4" />
              {t('sign-in-as-guest')}
            </Button>
          </div>
        </form>
      </div>
      {authenticating && <LoginToast />}
    </div>
  );
};

export default Login;
