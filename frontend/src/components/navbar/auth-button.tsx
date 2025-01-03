'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import supabase, { getAvatarUrl } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import useUserStore from '@/store/user';
import { Icons } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const UserAvatar = ({ user, className }: any) => {
  // State to handle image load error
  const [imgUrl, setImgUrl] = useState<string>('/logo-spaced.png');
  useEffect(() => {
    getAvatarUrl().then(setImgUrl);
  }, [user]);

  return (
    <Button
      className={
        className ??
        'w-8 h-8 rounded-full bg-primary/10 text-primary/80 hover:text-primary hover:bg-primary/20 overflow-hidden'
      }
    >
      <Avatar>
        <AvatarImage
          alt="avatar"
          src={imgUrl}
        />
        <AvatarFallback>
          {user.email?.match(/^([^@]+)/)?.[1] ?? '(No Name)'}
        </AvatarFallback>
      </Avatar>
    </Button>
  );
};

export const AuthButton = () => {
  const { user } = useUser();
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    useUserStore.getState().setUser(null);
    useUserStore.persist.clearStorage();
    router.push('/auth/login');
  };

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="ml-4 btn text-xs font-normal"
      >
        <Button variant="outline" size="sm">
          Login / Sign Up
        </Button>
      </Link>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex flex-col items-center w-96 p-4 gap-2 text-sm">
          <UserAvatar
            user={user}
            className="w-16 h-16 rounded-full bg-primary/20 text-primary overflow-hidden"
          />
          <span className="text-lg font-bold">
            {user.user_metadata.name ??
              user.email?.match(/^([^@]+)/)?.[1] ??
              '(No Name)'}
          </span>
          <span className="flex flex-col items-center gap-2">
            {user.email}
            {user.confirmed_at ? (
              <Icons.badgeCheck className="text-green-600 w-5 h-5" />
            ) : (
              <span className="text-red-500"> (unverified)</span>
            )}
          </span>
          <div className="flex items-center no-wrap gap-1 mt-8 w-full">
            <DropdownMenuItem
              onClick={() => router.push('/settings/models')}
              className={clsx(
                'flex w-64 items-center justify-start py-2 px-4 gap-1.5 bg-base-content/20 rounded-r-sm rounded-l-lg',
                'hover:bg-base-content/30'
              )}
            >
              <Icons.brain className="w-5 h-5" />
              Models
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push('https://github.com/dustland/agentok/issues')
              }
              className={clsx(
                'flex w-64 items-center justify-start py-2 px-4 gap-1.5 bg-base-content/20 rounded-l-sm rounded-r-lg',
                'hover:bg-base-content/30'
              )}
            >
              <Icons.github className="h-5 w-5" />
              Open Issues
            </DropdownMenuItem>
          </div>
          <div className="flex items-center no-wrap gap-1 w-full">
            <DropdownMenuItem
              onClick={() => router.push('/settings')}
              className={clsx(
                'flex w-64 items-center justify-start py-2 px-4 gap-1.5 bg-base-content/20 rounded-r-sm rounded-l-lg',
                'hover:bg-base-content/30'
              )}
            >
              <Icons.settings className="h-5 w-5" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={signOut}
              className={clsx(
                'flex w-64 items-center justify-start py-2 px-4 gap-1.5 bg-base-content/20 rounded-l-sm rounded-r-lg',
                'hover:bg-base-content/30'
              )}
            >
              <Icons.logout className="w-5 h-5" />
              Sign out
            </DropdownMenuItem>
          </div>
          <div className="flex items-center justify-center text-xs w-full gap-1">
            <Link
              href="https://agentok.ai/docs/privacy"
              target="_blank"
              className="link link-hover"
            >
              Privacy Policy
            </Link>
            <span className="">•</span>
            <Link
              href="https://agentok.ai/docs/tos"
              target="_blank"
              className="link link-hover"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
