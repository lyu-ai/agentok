'use client';

import { usePathname } from 'next/navigation';
import { match } from 'path-to-regexp';

import { AuthButton } from './auth-button';
import { Logo } from './logo';
import { NavButton } from './nav-button';
import { ProjectPicker } from '@/components/project/project-picker';
import Link from 'next/link';
import { Icons } from '../icons';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const apiEndpoint =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:5004';

export const NAV_MENU_ITEMS = [
  {
    id: 'chat',
    label: 'Chat',
    icon: Icons.robot,
    href: '/chat',
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: Icons.tool,
    href: `/tools`,
  },
  {
    id: 'discover',
    label: 'Discover',
    icon: Icons.compass,
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

  const pathSegments = pathname ? pathname.split('/').filter((p) => p) : []; // filter to remove any empty strings caused by leading/trailing slashes
  const isActive = (href: string) => {
    const hrefSegments = href.split('/').filter((p) => p);
    // Match the number of segments in the item's href
    return (
      pathSegments.length >= hrefSegments.length &&
      hrefSegments.every((seg, i) => seg === pathSegments[i])
    );
  };

  return (
    <div className="flex w-full items-center justify-between p-2 h-[var(--header-height)] border-b">
      <div className="navbar-start gap-2 flex items-center justify-start">
        <NavButton projectId={projectId} className="lg:hidden" />
        <Logo />
      </div>
      <div role="tablist" className="flex px-2 items-center gap-4">
        <div
          role="tab"
          className={cn('tab', { 'tab-active': isActive('/projects') })}
        >
          <ProjectPicker />
        </div>
        {NAV_MENU_ITEMS.map((item) => {
          return (
            <Link
              role="tab"
              key={item.id}
              href={item.href}
              className={cn(
                ' group flex items-center text-sm py-1 gap-1.5 hover:text-primary font-medium',
                'hidden lg:flex'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="https://agentok.ai/"
          target="_blank"
          rel="noreferrer"
          className="link link-hover text-xs hidden md:block"
        >
          Docs
        </Link>
        <Link
          href={apiEndpoint}
          target="_blank"
          rel="noreferrer"
          className="link link-hover text-xs hidden md:block"
        >
          API
        </Link>
        <Link
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
        </Link>
        <AuthButton />
      </div>
    </div>
  );
};

export default Navbar;
