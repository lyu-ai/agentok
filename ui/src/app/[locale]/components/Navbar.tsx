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
      <div className="navbar-center gap-2 hidden md:flex">
        <NavMenu />
      </div>
      <div className="navbar-end flex items-center my-auto gap-4">
        <a
          href="https://agentok.ai/"
          target="_blank"
          rel="noreferrer"
          className="link link-hover text-xs"
        >
          {t('docs')}
        </a>
        <a
          href="https://github.com/hughlv/agentok"
          aria-label="github"
          target="_blank"
        >
          <img
            src="https://img.shields.io/github/stars/hughlv/agentok?style=social"
            alt="github"
          />
        </a>
        {/* <ThemeSwitcher /> */}
        <AuthButton />
      </div>
    </div>
  );
};

export default Navbar;
