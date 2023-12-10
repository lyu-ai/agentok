import AuthButton from './AuthButton';
import NavMenu from './NavMenu';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import ThemeSwitcher from './ThemeSwitcher';
import NavLogo from './NavLogo';

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
        <NavLogo />
      </div>
      <div className="navbar-center gap-1">
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
