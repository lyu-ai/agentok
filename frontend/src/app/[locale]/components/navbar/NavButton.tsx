"use client";
import { HiMenuAlt2 } from "react-icons/hi";
import { Float } from "@headlessui-float/react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { NAV_MENU_ITEMS } from "./Navbar";
import { RiShuffleFill, RiShuffleLine } from "react-icons/ri";

const NavButton = ({ className }: any) => {
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
        <PopoverButton className={className}>
          <HiMenuAlt2 className="w-5 h-5" />
        </PopoverButton>
        <PopoverPanel className="origin-top-left absolute shadow-box shadow-gray-600 z-50 rounded-xl p-1 gap-2 backdrop-blur-md bg-gray-700/70 text-base-content border border-gray-600 overflow-auto max-h-[80vh]">
          {[
            {
              id: "projects",
              label: "Projects",
              icon: RiShuffleLine,
              activeIcon: RiShuffleFill,
              href: "/projects",
            },
            ...NAV_MENU_ITEMS,
          ].map((item) => (
            <PopoverButton
              as="a"
              href={item.href}
              key={item.id}
              className="group min-w-48 flex shrink-0 p-3 gap-2 items-center rounded-lg hover:bg-base-content/10 cursor-pointer"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </PopoverButton>
          ))}
        </PopoverPanel>
      </Float>
    </Popover>
  );
};

export default NavButton;
