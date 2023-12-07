'use client';

import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { RiAppsLine, RiRobot2Line } from 'react-icons/ri';
import { FaGithub } from 'react-icons/fa';
import { PiChatsCircleFill } from 'react-icons/pi';
import { usePathname } from 'next/navigation';

const NAV_MENU_ITEMS = [
  {
    id: 'flow',
    label: 'Build',
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

const Navbar = () => {
  const pathname = usePathname();
  return (
    <div className="navbar flex w-full items-center justify-between px-2">
      <div className="navbar-start">
        <a href="/" className="flex gap-2 items-end">
          <Image
            width={128}
            height={32}
            alt="logo"
            src="/logo-full-white.png"
            className="h-8 object-contain aspect-w-1 aspect-h-1"
          />
        </a>
      </div>
      <div className="navbar-center gap-6">
        {NAV_MENU_ITEMS.map(item => (
          <Link
            key={item.id}
            href={item.href}
            className={clsx('flex items-center gap-2 hover:text-white', {
              'text-primary': pathname?.includes(item.href),
            })}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </div>
      <div className="navbar-end">
        <a href="https://github.com/tiwater/flowgen" target="_blank">
          <FaGithub className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
};

export default Navbar;
