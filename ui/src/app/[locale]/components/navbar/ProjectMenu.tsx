// components/ProjectNavbar.js
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  RiSettings3Fill,
  RiSettings3Line,
  RiBook3Line,
  RiBook3Fill,
  RiToolsLine,
  RiToolsFill,
  RiSwap3Line,
  RiSwap3Fill,
} from 'react-icons/ri';
import clsx from 'clsx';
import { pathToRegexp } from 'path-to-regexp';
import ProjectPicker from './ProjectPicker';

const ProjectNavbar = ({ projectId }: any) => {
  const NAV_MENU_ITEMS = [
    {
      id: 'flow',
      label: 'Flow',
      icon: RiSwap3Line,
      activeIcon: RiSwap3Fill,
      href: `/projects/${projectId}/flow`,
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: RiToolsLine,
      activeIcon: RiToolsFill,
      href: `/projects/${projectId}/skills`,
    },
    {
      id: 'knowledge',
      label: 'Knowledge',
      icon: RiBook3Line,
      activeIcon: RiBook3Fill,
      href: `/projects/${projectId}/knowledge`,
    },
    {
      id: 'settings',
      label: 'Project settings',
      icon: RiSettings3Line,
      activeIcon: RiSettings3Fill,
      href: `/projects/${projectId}/settings`,
    },
  ];
  const pathname = usePathname();
  const regexResult = pathToRegexp('/projects/:projectId{/:feature}?').exec(
    pathname
  );

  return (
    <>
      {NAV_MENU_ITEMS.map(item => {
        const isActive =
          regexResult && regexResult.length >= 3 && regexResult[2] === item.id;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={clsx(
              'flex items-center text-sm py-1 gap-1 border-b  hover:text-primary/80',
              {
                'text-primary border-primary': isActive,
                'border-transparent': !isActive,
              }
            )}
          >
            {isActive ? (
              <item.activeIcon className="h-4 w-4" />
            ) : (
              <item.icon className="h-4 w-4" />
            )}
            {item.label}
          </Link>
        );
      })}
    </>
  );
};

export default ProjectNavbar;
