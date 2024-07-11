'use client';

import clsx from 'clsx';
import Link from 'next/link';
import {
  RiApps2Line,
  RiApps2Fill,
  RiRobot2Line,
  RiRobot2Fill,
  RiShoppingBag4Fill,
  RiShoppingBag4Line,
} from 'react-icons/ri';
import { usePathname } from 'next/navigation';

export const getGeneralMenuItems = () => {
  const NAV_MENU_ITEMS = [
    {
      id: 'projects',
      label: 'Projects',
      icon: RiApps2Line,
      activeIcon: RiApps2Fill,
      href: '/projects',
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: RiRobot2Line,
      activeIcon: RiRobot2Fill,
      href: '/chat',
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: RiShoppingBag4Line,
      activeIcon: RiShoppingBag4Fill,
      href: '/marketplace',
    },
  ];
  return NAV_MENU_ITEMS;
};

const GeneralMenu = () => {
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
      {getGeneralMenuItems().map(item => {
        const ItemIcon = isActive(item.href) ? item.activeIcon : item.icon;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={clsx(
              'group flex items-center text-sm py-1 gap-1.5 hover:text-primary',
              {
                'text-primary/80 border-b border-primary/80': isActive(
                  item.href
                ),
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

export default GeneralMenu;
