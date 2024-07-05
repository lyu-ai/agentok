'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const Logo = () => {
  const { theme } = useTheme();
  const [logo, setLogo] = useState('/logo.svg');
  useEffect(() => {
    if (theme === 'dim') {
      setLogo('/logo-white.svg');
    } else {
      setLogo('/logo.svg');
    }
  }, [theme]);
  return (
    <a href="/" className="flex shrink-0 gap-2 items-end">
      <img
        width={128}
        height={128}
        alt="logo"
        src={logo}
        className="h-6 w-auto object-contain aspect-w-1 aspect-h-1"
      />
      <div className="md:hidden h-7 w-auto ">Agentok Studio</div>
    </a>
  );
};

export default Logo;
