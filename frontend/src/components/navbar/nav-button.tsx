'use client';
import { NAV_MENU_ITEMS } from './navbar';
import { Icons } from '../icons';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from '../ui/popover';
import { Button } from '../ui/button';
import Link from 'next/link';

export const NavButton = ({ className }: any) => {
  return (
    <Popover>
      <PopoverTrigger className={className}>
        <Icons.menu className="w-5 h-5" />
      </PopoverTrigger>
      <PopoverContent className="origin-top-left absolute shadow-box shadow-gray-600 z-50 rounded-xl p-1 gap-2 backdrop-blur-md bg-gray-700/70 text-base-content border border-gray-600 overflow-auto max-h-[80vh]">
        {[
          {
            id: 'projects',
            label: 'Projects',
            icon: Icons.project,
            href: '/projects',
          },
          ...NAV_MENU_ITEMS,
        ].map((item) => (
          <PopoverClose asChild>
            <Link
              href={item.href}
              key={item.id}
              className="group min-w-48 flex shrink-0 p-3 gap-2 items-center rounded-lg hover:bg-base-content/10 cursor-pointer"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          </PopoverClose>
        ))}
      </PopoverContent>
    </Popover>
  );
};
