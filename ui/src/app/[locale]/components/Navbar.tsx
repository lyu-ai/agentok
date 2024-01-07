import AuthButton from './AuthButton';
import NavMenu from './NavMenu';
import ThemeSwitcher from './ThemeSwitcher';
import NavLogo from './NavLogo';
import NavButton from './NavButton';
import GitHubButton from '@/components/GitHubButton';
import { useTranslations } from 'next-intl';

const Navbar = () => {
  const t = useTranslations('component.Navbar');
  return (
    <div className="z-50 navbar flex w-full items-center justify-between px-2">
      <div className="navbar-start gap-2 flex items-center justify-start">
        <NavButton className="md:hidden" />
        <NavLogo />
      </div>
      <div className="navbar-center gap-1 hidden md:flex">
        <NavMenu />
      </div>
      <div className="navbar-end flex items-center my-auto gap-4">
        <a
          href="https://docs.flowgen.app/"
          target="_blank"
          rel="noreferrer"
          className="link link-hover text-xs"
        >
          {t('docs')}
        </a>
        <GitHubButton />
        {/* <ThemeSwitcher /> */}
        <AuthButton />
      </div>
    </div>
  );
};

export default Navbar;
