'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      {children}
      <>
        <Toaster />
      </>
    </ThemeProvider>
  );
};

export default Providers;
