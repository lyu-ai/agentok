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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ThemeSwitch } from './theme-switch';
import { cn } from '@/lib/utils';

const UserAvatar = ({ user, className }: any) => {
  // State to handle image load error
  const [imgUrl, setImgUrl] = useState<string>('');
  useEffect(() => {
    getAvatarUrl().then(setImgUrl);
  }, [user]);

  return (
    <Avatar>
      <AvatarImage alt="avatar" src={imgUrl} />
      <AvatarFallback>
        {user.email?.match(/^([^@]+)/)?.[1] ?? '(No Name)'}
      </AvatarFallback>
    </Avatar>
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
      <Link href="/auth/login" className="ml-4 btn text-xs font-normal">
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
      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center p-2 gap-2 text-sm">
          <UserAvatar user={user} className="w-20 h-20" />
          <div className="flex flex-col gap-1">
            <span className="font-bold">
              {user.user_metadata.name ??
                user.email?.match(/^([^@]+)/)?.[1] ??
                '(No Name)'}
            </span>
            <span className="flex items-center gap-2 text-xs">
              {user.email}
              {user.confirmed_at && (
                <Icons.badgeCheck className="text-green-600 w-3 h-3" />
              )}
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className={cn('flex items-center justify-start p-2 gap-2 py-3')}
          >
            <Icons.settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="https://github.com/dustland/agentok/issues/new"
            target="_blank"
            className={cn('flex items-center justify-start p-2 gap-2 py-3')}
          >
            <Icons.github className="h-4 w-4" />
            Report an Issue
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between gap-2 p-2 py-1">
          <span className="text-sm font-medium">Theme</span>
          <ThemeSwitch />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={signOut}
          className={clsx('flex items-center justify-start p-2 gap-2')}
        >
          <Icons.logout className="w-4 h-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
