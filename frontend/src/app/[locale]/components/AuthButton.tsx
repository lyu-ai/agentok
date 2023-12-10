'use client';
import { createClient } from '@/utils/supabase/client';
import { Float } from '@headlessui-float/react';
import { Popover } from '@headlessui/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaGithub, FaUserNinja } from 'react-icons/fa6';
import { MdLogout } from 'react-icons/md';

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
        'w-10 h-10 rounded-full bg-primary/10 text-primary/80 hover:text-primary hover:bg-primary/20 overflow-hidden'
      }
    >
      {user.user_metadata?.avatar_url && !imgLoadError ? (
        <img
          alt="avatar"
          src={user.user_metadata.avatar_url}
          onError={handleError}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <FaUserNinja className="w-full h-full p-2" />
      )}
    </div>
  );
};

const UserPanel = ({ user }: { user: any }) => {
  const router = useRouter();
  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/login');
  };
  return (
    <div className="flex flex-col items-center w-full p-4 gap-3 text-sm">
      <UserImage
        user={user}
        className="w-16 h-16 rounded-full bg-primary/20 text-primary overflow-hidden"
      />
      <span className="text-lg font-bold">
        {user.user_metadata?.name ??
          user.email?.match(/^([^@]+)/)?.[1] ??
          '(No Name)'}
      </span>
      <span className="">
        {user.email}
        {user.email_confirmed_at ? (
          <span className="text-green-500"> (verified)</span>
        ) : (
          <span className="text-red-500"> (unverified)</span>
        )}
      </span>
      <div className="join my-2">
        <a
          href={'https://github.com/tiwater/flowgen/issues/new'}
          target="_blank"
          className="w-40 join-item btn btn-ghost border border-base-content/50 hover:border-base-content rounded-full"
        >
          <FaGithub className="h-5 w-5" />
          Report Issues
        </a>
        <button
          onClick={signOut}
          className="w-40 join-item btn btn-ghost border border-base-content/50 hover:border-base-content rounded-full"
        >
          <MdLogout className="w-5 h-5" />
          Sign Out
        </button>
      </div>
      <div className="flex items-center justify-center text-xs w-full gap-2 mt-4">
        <Link
          href="https://docs.flowgen.dev/docs/privacy"
          target="_blank"
          className="link"
        >
          Privacy Policy
        </Link>
        <span className="">•</span>
        <Link
          href="https://docs.flowgen.dev/docs/tos"
          target="_blank"
          className="link"
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
        <Popover.Panel className="origin-top-right shadow-box-lg shadow-gray-600 rounded-xl backdrop-blur-md bg-gray-700/70 text-base-content border border-gray-600 max-h-[80vh]">
          <UserPanel user={user} />
        </Popover.Panel>
      </Float>
    </Popover>
  );
};

const AuthButton = () => {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const pathname = usePathname();
  useEffect(() => {
    supabase.auth.getUser().then(res => {
      setUser(res.data?.user);
    });
    // Set up a subscription to auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  if (pathname.includes('/login')) {
    return null; // don't show auth button on login page
  }

  return user ? (
    <UserAvatar user={user} />
  ) : (
    <Link href="/login" className="ml-4 btn btn-sm btn-primary rounded">
      Login / Sign Up
    </Link>
  );
};

export default AuthButton;
