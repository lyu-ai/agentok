'use client';

import pb from '@/utils/pocketbase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BiSolidFaceMask } from 'react-icons/bi';
import { FaGithub, FaMasksTheater, FaXTwitter } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { GoZap } from 'react-icons/go';
import { HiSparkles } from 'react-icons/hi2';

const providers = [
  { id: 'github', name: 'GitHub', icon: FaGithub },
  { id: 'google', name: 'Google', icon: FcGoogle },
  { id: 'twitter', name: 'X', icon: FaXTwitter },
];

const Login = ({
  searchParams: { redirectTo },
}: {
  searchParams: { redirectTo: string };
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const signIn = async (asGuest?: boolean) => {
    try {
      await pb
        .collection('users')
        .authWithPassword(
          asGuest ? 'hi@flowgen.app' : email,
          asGuest ? '12345678' : password
        );
      setError('');
      router.push(redirectTo ?? '/');
    } catch (e) {
      setError((e as any).message ?? `Sign in failed. ${e}`);
    }
  };

  const signInWithOAuth = async (provider: any) => {
    try {
      const authData = await pb.collection('users').authWithOAuth2({
        provider,
      });
      setError('');
      // Update the avatar and name
      // PocketBase will update email/verified automatically!
      // console.log(authData);
      // console.log(pb.authStore);
      // Different OAuth2 will be merged to the same user record, so need to update the user and avatar every time
      if (authData.meta?.name || authData.meta?.avatarUrl) {
        const formData = new FormData();
        if (!authData.meta?.name) {
          formData.append('name', authData.meta?.name);
        }
        if (authData.meta?.avatarUrl) {
          const avatarResp = await fetch(authData.meta?.avatarUrl).then(resp =>
            resp.blob()
          );
          formData.append('avatar', avatarResp);
        }

        await pb.collection('users').update(authData.record.id, formData);
      }
      router.push(redirectTo ?? '/');
    } catch (e) {
      setError(`Auth with ${provider} failed. ${e}`);
    }
  };

  const signUp = async () => {
    try {
      const authData = await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
      });
      setError('');
    } catch (e) {
      setError(`Sign up failed. ${e}`);
    }
  };

  // for the `session` to be available on first SSR render, it must be
  // fetched in a Server Component and passed down as a prop
  return (
    <div className="flex-1 flex flex-col w-full items-center px-8 justify-center gap-2">
      <title>Sign In | FlowGen</title>
      <div className="flex flex-col gap-3 w-96">
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
            placeholder="hi@flowgen.app"
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
            placeholder="12345678"
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
              className="link link-hover link-primary flex items-center gap-1"
              onClick={() => signIn(true)}
            >
              <GoZap className="w-4 h-4" />
              Login as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
