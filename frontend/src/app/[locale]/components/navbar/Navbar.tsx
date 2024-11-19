'use client';

import { usePathname } from 'next/navigation';
import { match } from 'path-to-regexp';

import AuthButton from './AuthButton';
import NavLogo from './NavLogo';
import NavButton from './NavButton';
import { useTranslations } from 'next-intl';
import ProjectPicker from './ProjectPicker';
import { Tooltip } from 'react-tooltip';
import {
  RiRobot2Line,
  RiRobot2Fill,
  RiHammerLine,
  RiHammerFill,
  RiCompassLine,
  RiCompassFill,
} from 'react-icons/ri';
import Link from 'next/link';
import clsx from 'clsx';
import path from 'path';

const apiEndpoint =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:5004';

export const NAV_MENU_ITEMS = [
  {
    id: 'chat',
    label: 'Chat',
    icon: RiRobot2Line,
    activeIcon: RiRobot2Fill,
    href: '/chat',
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: RiHammerLine,
    activeIcon: RiHammerFill,
    href: `/tools`,
  },
  {
    id: 'discover',
    label: 'Discover',
    icon: RiCompassLine,
    activeIcon: RiCompassFill,
    href: '/discover',
  },
];

const Navbar = () => {
  const pathname = usePathname();

  // Create a matcher function
  const matchPath = match<{
    projectId: string;
    feature?: string;
    sub?: string;
  }>('/projects/:projectId/:feature/:sub');

  // Execute the matcher
  const result = matchPath(pathname);
  const projectId = result ? parseInt(result.params.projectId, 10) : null;

  const t = useTranslations('component.Navbar');

  const pathSegments = pathname ? pathname.split('/').filter((p) => p) : []; // filter to remove any empty strings caused by leading/trailing slashes
  const isActive = (href: string) => {
    const hrefSegments = href.split('/').filter((p) => p);
    // Match the number of segments in the item's href
    return (
      pathSegments.length >= hrefSegments.length &&
      hrefSegments.every((seg, i) => seg === pathSegments[i])
    );
  };

  const isAuthPage = pathname.startsWith('/auth');

  return (
    <div className="navbar flex w-full items-center justify-between px-2">
      <div className="navbar-start gap-2 flex items-center justify-start">
        {!isAuthPage && (
          <NavButton projectId={projectId} className="lg:hidden" />
        )}
        <NavLogo />
      </div>
      {!isAuthPage && (
        <div role="tablist" className="flex navbar-center tabs tabs-boxed px-2">
          <div
            role="tab"
            className={clsx('tab', { 'tab-active': isActive('/projects') })}
          >
            <ProjectPicker />
          </div>
          {NAV_MENU_ITEMS.map((item) => {
            const ItemIcon = item.icon;
            return (
              <Link
                role="tab"
                key={item.id}
                href={item.href}
                className={clsx(
                  'tab group flex items-center text-sm py-1 gap-1.5 hover:text-primary',
                  {
                    'tab-active': isActive(item.href),
                  },
                  'hidden lg:flex'
                )}
              >
                <ItemIcon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
      <div className="navbar-end flex items-center my-auto gap-4">
        <a
          href="https://agentok.ai/"
          target="_blank"
          rel="noreferrer"
          className="link link-hover text-xs hidden md:block"
        >
          {t('docs')}
        </a>
        <a
          href={apiEndpoint}
          target="_blank"
          rel="noreferrer"
          className="link link-hover text-xs hidden md:block"
        >
          API
        </a>
        <a
          href="https://github.com/hughlv/agentok"
          aria-label="github"
          target="_blank"
          className="hidden md:block"
        >
          <img
            src="https://img.shields.io/github/stars/hughlv/agentok?style=flat&logo=github&color=black&labelColor=gray&label=Stars"
            alt="github"
            className="rounded h-5"
          />
        </a>
        {/* <ThemeSwitcher /> */}
        <AuthButton />
      </div>
      <Tooltip id="nav-tooltip" />
    </div>
  );
};

export default Navbar;
