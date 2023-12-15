'use client';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const Logo = () => {
  const { theme } = useTheme();
  const [logo, setLogo] = useState('/logo-full-white.png');
  const [miniLogo, setMiniLogo] = useState('/logo-white.svg');
  useEffect(() => {
    if (theme === 'dim') {
      setLogo('/logo-full-white.png?231215');
      setMiniLogo('/logo-white.svg');
    } else {
      setLogo('/logo-full.png?231215');
      setMiniLogo('/logo.svg');
    }
  }, [theme]);
  return (
    <a href="/" className="flex shrink-0 gap-2 items-end">
      <Image
        priority
        width={128}
        height={128}
        alt="logo"
        src={logo}
        className="hidden md:block h-7 w-auto object-contain aspect-w-1 aspect-h-1"
      />
      <Image
        priority
        width={48}
        height={48}
        alt="logo"
        src={miniLogo}
        className="md:hidden h-7 w-auto object-contain aspect-w-1 aspect-h-1"
      />
    </a>
  );
};

export default Logo;
