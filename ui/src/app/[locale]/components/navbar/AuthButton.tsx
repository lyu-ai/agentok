'use client';
import { Float } from '@headlessui-float/react';
import { Popover, PopoverPanel, PopoverButton } from '@headlessui/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GoPersonFill } from 'react-icons/go';
import clsx from 'clsx';
import supabase, { getAvatarUrl } from '@/utils/supabase/client';
import {
  RiBrainLine,
  RiGithubLine,
  RiLogoutCircleRLine,
  RiSettings3Line,
  RiVerifiedBadgeLine,
} from 'react-icons/ri';
import { useUser } from '@/hooks/useUser';

const UserImage = ({ user, className }: any) => {
  // State to handle image load error
  const [imgUrl, setImgUrl] = useState<string>('/logo-spaced.png');
  useEffect(() => {
    getAvatarUrl().then(setImgUrl);
  }, [user]);

  return (
    <div
      className={
        className ??
        'w-8 h-8 rounded-full bg-primary/10 text-primary/80 hover:text-primary hover:bg-primary/20 overflow-hidden'
      }
    >
      {imgUrl ? (
        <img
          alt="avatar"
          src={imgUrl}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <GoPersonFill className="w-full h-full p-2" />
      )}
    </div>
  );
};

const UserPanel = ({ user }: { user: any }) => {
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="flex flex-col items-center w-96 p-4 gap-2 text-sm">
      <UserImage
        user={user}
        className="mt-8 w-16 h-16 rounded-full bg-primary/20 text-primary overflow-hidden"
      />
      <span className="text-lg font-bold">
        {user.user_metadata.name ?? user.email?.match(/^([^@]+)/)?.[1] ?? '(No Name)'}
      </span>
      <span className="flex flex-col items-center gap-2">
        {user.email}
        {user.confirmed_at ? (
          <RiVerifiedBadgeLine className="text-green-600 w-5 h-5" />
        ) : (
          <span className="text-red-500"> (unverified)</span>
        )}
      </span>
      <a
        href="https://discord.gg/FeFSxWtn"
        aria-label="discord"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="https://dcbadge.vercel.app/api/server/xBQxwRSWfm?timestamp=20240714"
          alt="discord"
          className="rounded-lg"
        />
      </a>
      <div className="flex items-center no-wrap gap-1 mt-8 w-full">
        <PopoverButton
          onClick={() => router.push('/settings/models')}
          className={clsx(
            'flex w-64 items-center justify-start py-2 px-4 gap-1.5 bg-base-content/20 rounded-r-sm rounded-l-lg',
            'hover:bg-base-content/30'
          )}
        >
          <RiBrainLine className="w-5 h-5" />
          Models
        </PopoverButton>
        <PopoverButton
          onClick={() =>
            router.push('https://github.com/hughlv/agentok/issues')
          }
          className={clsx(
            'flex w-64 items-center justify-start py-2 px-4 gap-1.5 bg-base-content/20 rounded-l-sm rounded-r-lg',
            'hover:bg-base-content/30'
          )}
        >
          <RiGithubLine className="h-5 w-5" />
          Open Issues
        </PopoverButton>
      </div>
      <div className="flex items-center no-wrap gap-1 w-full">
        <PopoverButton
          onClick={() => router.push('/settings')}
          className={clsx(
            'flex w-64 items-center justify-start py-2 px-4 gap-1.5 bg-base-content/20 rounded-r-sm rounded-l-lg',
            'hover:bg-base-content/30'
          )}
        >
          <RiSettings3Line className="h-5 w-5" />
          Settings
        </PopoverButton>

        <PopoverButton
          onClick={signOut}
          className={clsx(
            'flex w-64 items-center justify-start py-2 px-4 gap-1.5 bg-base-content/20 rounded-l-sm rounded-r-lg',
            'hover:bg-base-content/30'
          )}
        >
          <RiLogoutCircleRLine className="w-5 h-5" />
          Sign out
        </PopoverButton>
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
  );
};

const UserAvatar = ({ user }: any) => {
  return (
    <Popover>
      <Float
        placement="bottom-end"
        shift
        offset={2}
        enter="transition ease-out duration-150"
        enterFrom="transform origin-top-right scale-0 opacity-0"
        enterTo="transform origin-top-right scale-100 opacity-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-0 opacity-0"
      >
        <PopoverButton className="flex my-auto">
          <UserImage user={user} />
        </PopoverButton>
        <PopoverPanel className="origin-top-right shadow-box-lg shadow-gray-600 rounded-xl backdrop-blur-md bg-gray-700/70 text-base-content border border-gray-600">
          <UserPanel user={user} />
        </PopoverPanel>
      </Float>
    </Popover>
  );
};

const AuthButton = () => {
  const { user } = useUser();
  const pathname = usePathname();

  if (pathname.includes('/auth')) {
    return null; // don't show auth button on login page
  }

  return user ? (
    <UserAvatar user={user} />
  ) : (
    <Link
      href="/auth/login"
      className="ml-4 btn btn-sm btn-primary rounded text-xs font-normal"
    >
      Login / Sign Up
    </Link>
  );
};

export default AuthButton;
