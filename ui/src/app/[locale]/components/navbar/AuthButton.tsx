'use client';
import { Float } from '@headlessui-float/react';
import { Popover, PopoverPanel, PopoverButton } from '@headlessui/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GoPersonFill } from 'react-icons/go';
import clsx from 'clsx';
import pb, { getAvatarUrl } from '@/utils/pocketbase/client';
import { RiBrainLine, RiLogoutBoxLine, RiSettings3Line } from 'react-icons/ri';

const UserImage = ({ user, className }: any) => {
  // State to handle image load error
  const [imgLoadError, setImgLoadError] = useState(false);

  const handleError = () => {
    console.warn('Failed to load avatar image', user.user_metadata?.avatar_url);
    setImgLoadError(true);
  };
  return (
    <div
      className={
        className ??
        'w-8 h-8 rounded-full bg-primary/10 text-primary/80 hover:text-primary hover:bg-primary/20 overflow-hidden'
      }
    >
      {user.avatar && !imgLoadError ? (
        <img
          alt="avatar"
          src={getAvatarUrl(user)}
          onError={handleError}
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
    pb.authStore.clear();
    router.replace('/auth/login');
  };

  return (
    <div className="flex flex-col items-center w-80 p-4 gap-3 text-sm">
      <UserImage
        user={user}
        className="w-16 h-16 rounded-full bg-primary/20 text-primary overflow-hidden"
      />
      <span className="text-lg font-bold">
        {user.name ?? user.email?.match(/^([^@]+)/)?.[1] ?? '(No Name)'}
      </span>
      <span className="">
        {user.email}
        {user.verified ? (
          <span className="text-green-500"> (verified)</span>
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
          src="https://dcbadge.vercel.app/api/server/xBQxwRSWfm?timestamp=20240705"
          alt="discord"
          className="rounded-lg"
        />
      </a>
      <PopoverButton
        onClick={() => router.push('/settings/models')}
        className={clsx(
          'flex w-full items-center justify-start py-2 px-6 gap-2 bg-base-content/20 mt-8  rounded-xl',
          'hover:bg-base-content/30'
        )}
      >
        <RiBrainLine className="w-5 h-5" />
        Manage Shared LLM Models
      </PopoverButton>
      <div className="flex items-center no-wrap gap-1 w-full">
        <PopoverButton
          onClick={() => router.push('/settings')}
          className={clsx(
            'flex w-40 items-center justify-start py-2 px-6 gap-2 bg-base-content/20  rounded-l-xl',
            'hover:bg-base-content/30'
          )}
        >
          <RiSettings3Line className="h-5 w-5" />
          Settings
        </PopoverButton>

        <PopoverButton
          onClick={signOut}
          className={clsx(
            'flex w-40 items-center justify-center p-2 gap-2 bg-base-content/20  rounded-r-xl',
            'hover:bg-base-content/30'
          )}
        >
          <RiLogoutBoxLine className="w-5 h-5" />
          Sign out
        </PopoverButton>
      </div>

      <div className="flex items-center justify-center text-xs w-full gap-2">
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
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  useEffect(() => {
    setUser(pb.authStore.model);
    const unsubsribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.model);
    });
    return unsubsribe;
  }, []);

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
