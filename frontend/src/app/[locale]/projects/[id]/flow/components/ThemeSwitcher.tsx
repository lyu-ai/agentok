// Refer to https://github.com/pacocoursey/next-themes/pull/171
'use client';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

const useThemeSwitcher = () => {
  const [mode, setMode] = useState('');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMode(theme!);
  }, [theme]);

  return { mode, setTheme };
};

const ThemeSwitcher = () => {
  const t = useTranslations('component.ThemeSwitcher');
  const { mode: theme, setTheme } = useThemeSwitcher();

  const toggleTheme = (e: any) => {
    e.preventDefault();
    setTheme(theme === 'dim' ? 'emerald' : 'dim');
  };

  return (
    <div
      className="btn btn-sm btn-ghost btn-circle"
      onClick={toggleTheme}
      data-tooltip-content={t('theme-tooltip')}
      data-tooltip-id="default-tooltip"
    >
      <label
        className={clsx('swap swap-rotate', {
          'swap-active': theme === 'dim',
        })}
      >
        <HiOutlineMoon className="swap-off w-5 h-5" />
        <HiOutlineSun className="swap-on w-5 h-5" />
      </label>
    </div>
  );
};

export default ThemeSwitcher;
