import './globals.css';
import { PropsWithChildren } from 'react';
import Providers from './providers';
import localFont from 'next/font/local';
import { cn } from '@/lib/utils';

const fontSans = localFont({
  src: [
    {
      path: '../assets/fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Inter-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
});

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: '../assets/fonts/Inter-Bold.woff2',
  variable: '--font-heading',
});

export default async function RootLayout({
  children,
}: PropsWithChildren) {
  return (
    <html suppressHydrationWarning>
      <title>Agentok Studio</title>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
