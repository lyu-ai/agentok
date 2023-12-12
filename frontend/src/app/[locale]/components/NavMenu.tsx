'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { PiChatsCircleFill } from 'react-icons/pi';
import { RiRobot2Line, RiAppsLine } from 'react-icons/ri';
import { usePathname } from 'next/navigation';

export const NAV_MENU_ITEMS = [
  {
    id: 'flow',
    label: 'Flow',
    icon: RiRobot2Line,
    href: '/flow',
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: PiChatsCircleFill,
    href: '/chat',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: RiAppsLine,
    href: '/gallery',
  },
];

const NavMenu = () => {
  const pathname = usePathname();
  return (
    <>
      {NAV_MENU_ITEMS.map(item => (
        <Link
          key={item.id}
          href={item.href}
          className={clsx(
            'flex items-center rounded-md py-2 px-4 gap-2 hover:text-primary/80 hover:bg-primary/5',
            {
              'text-primary bg-primary/10': pathname?.includes(item.href),
            }
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </>
  );
};

export default NavMenu;
