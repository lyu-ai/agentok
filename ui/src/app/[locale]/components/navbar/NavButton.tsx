'use client';
import { HiMenuAlt2 } from 'react-icons/hi';
import { Float } from '@headlessui-float/react';
import { Popover } from '@headlessui/react';
import { getGeneralMenuItems } from './GeneralMenu';
import { getProjectNavbarItems } from './ProjectMenu';

const NavButton = ({ projectId, className }: any) => {
  const NAV_MENU_ITEMS = projectId
    ? getProjectNavbarItems(projectId)
    : getGeneralMenuItems();
  return (
    <Popover>
      <Float
        placement="bottom"
        enter="transition ease-out duration-300"
        enterFrom="transform scale-0 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-0 opacity-0"
      >
        <Popover.Button className={className}>
          <HiMenuAlt2 className="w-5 h-5" />
        </Popover.Button>
        <Popover.Panel className="origin-top-left absolute shadow-box shadow-gray-600 z-50 rounded-xl p-1 gap-2 backdrop-blur-md bg-gray-700/70 text-base-content border border-gray-600 overflow-auto max-h-[80vh]">
          {NAV_MENU_ITEMS.map(item => (
            <Popover.Button
              as="a"
              href={item.href}
              key={item.id}
              className="group min-w-48 flex shrink-0 p-3 gap-2 items-center rounded-lg hover:bg-base-content/10 cursor-pointer"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Popover.Button>
          ))}
        </Popover.Panel>
      </Float>
    </Popover>
  );
};

export default NavButton;
