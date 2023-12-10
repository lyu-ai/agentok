import AuthButton from './AuthButton';
import NavMenu from './NavMenu';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import ThemeSwitcher from './ThemeSwitcher';
import NavLogo from './NavLogo';
import { HiMenuAlt2 } from 'react-icons/hi';

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
      <div className="navbar-start gap-1">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-sm btn-circle btn-ghost md:hidden"
          >
            <HiMenuAlt2 className="w-5 h-5" />
          </div>
          <div className="menu menu-sm dropdown-content dark:bg-gray-800 rounded-md gap-2 w-52">
            <NavMenu />
          </div>
        </div>
        <NavLogo />
      </div>
      <div className="navbar-center gap-1 hidden md:flex">
        <NavMenu />
      </div>
      <div className="navbar-end flex items-center gap-2">
        <ThemeSwitcher />
        {isSupabaseConnected && <AuthButton />}
      </div>
    </div>
  );
};

export default Navbar;
