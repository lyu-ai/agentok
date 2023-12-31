'use client';
import { Float } from '@headlessui-float/react';
import { Popover } from '@headlessui/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GoBug, GoPersonFill, GoSignOut } from 'react-icons/go';
import { PiGithubLogo } from 'react-icons/pi';
import clsx from 'clsx';
import pb, { getAvatarUrl } from '@/utils/pocketbase/client';

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
    <div className="flex flex-col items-center w-full p-4 gap-3 text-sm">
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
      <div className="flex items-center no-wrap my-2 gap-1">
        <a
          href={'https://github.com/tiwater/flowgen/issues/new'}
          target="_blank"
          className={clsx(
            'w-40 flex items-center justify-center p-4 gap-2 bg-base-content/20  rounded-l-full',
            'hover:bg-base-content/30'
          )}
        >
          <PiGithubLogo className="h-5 w-5" />
          Report Issues
        </a>
        <div
          onClick={signOut}
          className={clsx(
            'w-40 flex items-center justify-center p-4 gap-2 bg-base-content/20 rounded-l-[2px] rounded-r-full cursor-pointer',
            'hover:bg-base-content/30'
          )}
        >
          <GoSignOut className="w-5 h-5" />
          Sign Out
        </div>
      </div>
      <div className="flex items-center justify-center text-xs w-full gap-2 mt-4">
        <Link
          href="https://docs.flowgen.app/docs/privacy"
          target="_blank"
          className="link link-hover"
        >
          Privacy Policy
        </Link>
        <span className="">•</span>
        <Link
          href="https://docs.flowgen.app/docs/tos"
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
        <Popover.Button className="flex my-auto">
          <UserImage user={user} />
        </Popover.Button>
        <Popover.Panel className="origin-top-right shadow-box-lg shadow-gray-600 rounded-xl backdrop-blur-md bg-gray-700/70 text-base-content border border-gray-600">
          <UserPanel user={user} />
        </Popover.Panel>
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
      className="ml-4 btn btn-sm btn-primary rounded font-normal"
    >
      Login / Sign Up
    </Link>
  );
};

export default AuthButton;
