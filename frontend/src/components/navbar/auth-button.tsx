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
      <AvatarFallback className={cn(className)}>
        {user.email?.match(/^([^@]+)/)?.[1] ?? '(No Name)'}
      </AvatarFallback>
    </Avatar>
  );
};

const apiEndpoint =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:5004';

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
        <UserAvatar
          user={user}
          className="w-10 h-10 bg-muted-foreground/50 text-muted"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex flex-col gap-1 w-64 text-sm"
      >
        <div className="flex items-center p-2 gap-2">
          <UserAvatar
            user={user}
            className="w-10 h-10 bg-muted-foreground/50 text-muted"
          />
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
            href="/settings/account"
            className={cn('flex items-center justify-start p-2 gap-2')}
          >
            <Icons.user className="h-4 w-4" />
            Account Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/settings/models"
            className={cn('flex items-center justify-start p-2 gap-2')}
          >
            <Icons.robot className="h-4 w-4" />
            Models
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/settings/api-keys"
            className={cn('flex items-center justify-start p-2 gap-2')}
          >
            <Icons.key className="h-4 w-4" />
            API Keys
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={`${apiEndpoint}`}
            target="_blank"
            className={cn('flex items-center justify-start p-2 gap-2')}
          >
            <Icons.docs className="h-4 w-4" />
            API Documentation
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="https://github.com/dustland/agentok/issues/new"
            target="_blank"
            className={cn('flex items-center justify-start p-2 gap-2')}
          >
            <Icons.github className="h-4 w-4" />
            Report an Issue
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between gap-2 p-2 py-1 rounded-md hover:bg-muted">
          <div className="flex items-center gap-2">
            <Icons.theme className="h-4 w-4" />
            <span className="text-sm font-medium">Theme</span>
          </div>
          <ThemeSwitch />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={signOut}
          className={cn('flex items-center justify-start px-2 py-1 gap-2')}
        >
          <Icons.logout className="w-4 h-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
