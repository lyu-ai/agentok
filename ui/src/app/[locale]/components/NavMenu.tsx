'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { PiChatsCircle } from 'react-icons/pi';
import { RiRobot2Line, RiAppsLine } from 'react-icons/ri';
import { usePathname } from 'next/navigation';

export const NAV_MENU_ITEMS = [
  {
    id: 'flow',
    label: 'Autoflow',
    icon: RiRobot2Line,
    href: '/flow',
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: PiChatsCircle,
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
            'flex items-center rounded-md py-2 px-4 gap-2 hover:text-primary/80 hover:bg-primary/5',
            {
              'text-primary bg-primary/10': isActive(item.href),
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
