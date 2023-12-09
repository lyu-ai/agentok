import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';

import AuthButton from './AuthButton';
import NavMenu from './NavMenu';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

const Navbar = () => {
  const cookieStore = cookies();
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient(cookieStore);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();
  return (
    <div className="z-50 navbar flex w-full items-center justify-between px-2">
      <div className="navbar-start">
        <a href="/" className="flex gap-2 items-end">
          <Image
            priority
            width={128}
            height={32}
            alt="logo"
            src="/logo-full-white.png"
            className="h-8 object-contain aspect-w-1 aspect-h-1"
          />
        </a>
      </div>
      <div className="navbar-center gap-2">
        <NavMenu />
        <a
          href="https://github.com/tiwater/flowgen"
          target="_blank"
          className="text-base-content/80 hover:text-base-content"
        >
          <FaGithub className="h-5 w-5" />
        </a>
      </div>
      <div className="navbar-end flex items-center gap-2">
        {isSupabaseConnected && <AuthButton />}
      </div>
    </div>
  );
};

export default Navbar;
