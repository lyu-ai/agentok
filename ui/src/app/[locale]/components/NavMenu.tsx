'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { PiChatsCircle, PiChatsCircleFill } from 'react-icons/pi';
import {
  RiRobot2Line,
  RiAppsLine,
  RiRobot2Fill,
  RiAppsFill,
  RiSettingsFill,
  RiSettingsLine,
} from 'react-icons/ri';
import { usePathname } from 'next/navigation';

export const NAV_MENU_ITEMS = [
  {
    id: 'flows',
    label: 'Autoflows',
    icon: RiRobot2Line,
    activeIcon: RiRobot2Fill,
    href: '/flows',
  },
  {
    id: 'chats',
    label: 'Chats',
    icon: PiChatsCircle,
    activeIcon: PiChatsCircleFill,
    href: '/chats',
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: RiAppsLine,
    activeIcon: RiAppsFill,
    href: '/templates',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: RiSettingsLine,
    activeIcon: RiSettingsFill,
    href: '/settings',
  },
];

const NavMenu = () => {
  const pathname = usePathname();
  const pathSegments = pathname ? pathname.split('/').filter(p => p) : []; // filter to remove any empty strings caused by leading/trailing slashes

  // Function to determine if the current path segment matches the item's href
  const isActive = (href: string) => {
    const hrefSegments = href.split('/').filter(p => p);
    // Match the number of segments in the item's href
    return (
      pathSegments.length >= hrefSegments.length &&
      hrefSegments.every((seg, i) => seg === pathSegments[i])
    );
  };

  return (
    <>
      {NAV_MENU_ITEMS.map(item => (
        <Link
          key={item.id}
          href={item.href}
          className={clsx(
            'flex items-center rounded-full text-sm py-1 px-3 gap-2 hover:text-primary/80 hover:bg-base-content/30',
            {
              'text-primary bg-base-content/20': isActive(item.href),
            }
          )}
        >
          {isActive(item.href) ? (
            <item.activeIcon className="h-4 w-4" />
          ) : (
            <item.icon className="h-4 w-4" />
          )}
          {item.label}
        </Link>
      ))}
    </>
  );
};

export default NavMenu;
