// Refer to https://github.com/pacocoursey/next-themes/pull/171
'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/icons';

const useThemeSwitcher = () => {
  const [mode, setMode] = useState('');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMode(theme!);
  }, [theme]);

  return { mode, setTheme };
};

const ThemeSwitcher = () => {
  const { mode: theme, setTheme } = useThemeSwitcher();

  const toggleTheme = (e: any) => {
    e.preventDefault();
    setTheme(theme === 'dim' ? 'emerald' : 'dim');
  };

  return (
    <div
      className="btn btn-sm btn-ghost btn-circle"
      onClick={toggleTheme}
      data-tooltip-content="Switch Light/Dark Mode"
      data-tooltip-id="default-tooltip"
    >
      <label
        className={cn('swap swap-rotate', {
          'swap-active': theme === 'dim',
        })}
      >
        <Icons.moon className="swap-off w-5 h-5" />
        <Icons.sun className="swap-on w-5 h-5" />
      </label>
    </div>
  );
};

export default ThemeSwitcher;
