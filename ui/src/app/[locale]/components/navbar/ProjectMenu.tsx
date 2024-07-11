// components/ProjectNavbar.js
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  RiSettings3Fill,
  RiSettings3Line,
  RiBook3Line,
  RiBook3Fill,
  RiSwap3Line,
  RiSwap3Fill,
  RiPuzzle2Line,
  RiPuzzle2Fill,
  RiBookMarkedLine,
  RiBookMarkedFill,
} from 'react-icons/ri';
import clsx from 'clsx';
import { pathToRegexp } from 'path-to-regexp';

export const getProjectNavbarItems = (projectId: string) => {
  const NAV_MENU_ITEMS = [
    {
      id: 'flow',
      label: 'Flow',
      icon: RiSwap3Line,
      activeIcon: RiSwap3Fill,
      href: `/projects/${projectId}/flow`,
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: RiPuzzle2Line,
      activeIcon: RiPuzzle2Fill,
      href: `/projects/${projectId}/tools`,
    },
    {
      id: 'knowledge',
      label: 'Knowledge',
      icon: RiBookMarkedLine,
      activeIcon: RiBookMarkedFill,
      href: `/projects/${projectId}/knowledge`,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: RiSettings3Line,
      activeIcon: RiSettings3Fill,
      href: `/projects/${projectId}/settings`,
    },
  ];
  return NAV_MENU_ITEMS;
};

const ProjectNavbar = ({ projectId }: any) => {
  const pathname = usePathname();
  const regexResult = pathToRegexp(
    '/projects/:projectId{/:feature}?{/:sub}?'
  ).exec(pathname);

  return (
    <>
      {getProjectNavbarItems(projectId).map(item => {
        const isActive =
          regexResult && regexResult.length >= 3 && regexResult[2] === item.id;
        const ItemIcon = isActive ? item.activeIcon : item.icon;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={clsx(
              'group flex items-center text-sm py-1 gap-1.5 border-b  hover:text-primary/80',
              {
                'text-primary border-primary': isActive,
                'border-transparent': !isActive,
              }
            )}
          >
            <ItemIcon className="h-4 w-4 group-hover:scale-125 transform transition duration-700 ease-in-out" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
};

export default ProjectNavbar;
