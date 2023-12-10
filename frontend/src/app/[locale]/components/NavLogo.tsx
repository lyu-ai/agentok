'use client';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const Logo = () => {
  const { theme } = useTheme();
  const [logo, setLogo] = useState('/logo-full-white.png');
  useEffect(() => {
    if (theme === 'dim') {
      setLogo('/logo-full-white.png');
    } else {
      setLogo('/logo-full.png');
    }
  }, [theme]);
  return (
    <a href="/" className="flex gap-2 items-end">
      <Image
        priority
        width={128}
        height={32}
        alt="logo"
        src={logo}
        className="h-8 object-contain aspect-w-1 aspect-h-1"
      />
    </a>
  );
};

export default Logo;
