'use client';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import {
  PiKey,
  PiKeyFill,
  PiReceipt,
  PiReceiptFill,
  PiToolbox,
  PiToolboxFill,
  PiUser,
  PiUserFill,
} from 'react-icons/pi';

type SettingPath = {
  id: string;
  label: string;
  icon: IconType;
  activeIcon: IconType;
  href: string;
};

const SettingLink = ({ path }: { path: SettingPath }) => {
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setIsActive(path.href === pathname);
  }, [path, pathname]);
  return (
    <Link
      href={path.href}
      key={path.id}
      className={clsx(
        'flex items-center justify-start p-2 gap-2 rounded-md hover:bg-base-content/20',
        {
          'bg-base-content/10': isActive,
        }
      )}
    >
      {isActive ? (
        <path.activeIcon className="w-4 h-4" />
      ) : (
        <path.icon className="w-4 h-4" />
      )}
      <span className="hidden lg:flex text-base-content text-sm">
        {path.label}
      </span>
    </Link>
  );
};

const SettingsLayout = ({ children }: PropsWithChildren) => {
  const t = useTranslations('page.Settings');
  const paths: SettingPath[] = [
    // {
    //   id: 'account',
    //   label: t('account'),
    //   icon: PiUser,
    //   activeIcon: PiUserFill,
    //   href: '/settings/account',
    // },
    // {
    //   id: 'tools',
    //   label: t('tools'),
    //   icon: PiToolbox,
    //   activeIcon: PiToolboxFill,
    //   href: '/settings/tools',
    // },
    {
      id: 'apikeys',
      label: t('apikeys'),
      icon: PiKey,
      activeIcon: PiKeyFill,
      href: '/admin/api-keys',
    },
    // {
    //   id: 'billing',
    //   label: t('billing'),
    //   icon: PiReceipt,
    //   activeIcon: PiReceiptFill,
    //   href: '/settings/billing',
    // },
  ];

  return (
    <div className="flex w-full h-full p-2 gap-2">
      <div className="flex md:flex-shrink-0 lg:min-w-64 h-full">
        <div className="flex flex-col rounded-md bg-base-content/5 gap-1 w-full h-full overflow-y-auto p-2">
          {paths.map(path => (
            <SettingLink key={path.id} path={path} />
          ))}
        </div>
      </div>
      <div className="flex flex-col flex-grow w-full h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;
