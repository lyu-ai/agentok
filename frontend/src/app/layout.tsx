'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { GoHome } from 'react-icons/go';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({ subsets: ['latin'] });
import { Tooltip } from 'react-tooltip';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-theme="night" suppressHydrationWarning>
      <title>Flowgen</title>
      <body className={inter.className} suppressHydrationWarning>
        <div className="flex flex-col h-screen w-full items-center text-base-content">
          <div className="flex w-full items-center justify-between h-12 p-2">
            <a href="/" className="flex gap-2 items-end">
              <img
                alt="logo"
                src="/logo-full-white.png"
                className="h-8 object-contain aspect-w-1 aspect-h-1"
              />
            </a>
          </div>
          {children}
        </div>
        <ToastContainer
          position="bottom-right"
          theme="colored"
          hideProgressBar
        />
        <Tooltip
          id="default-tooltip"
          className="bg-base-100 text-base-content"
          place="bottom"
        />
        <Tooltip
          id="html-tooltip"
          classNameArrow="html-tooltip-arrow bg-gray-700 border-r border-b border-gray-500"
          className="!bg-gray-600 !border !border-gray-500 !text-gray-200 !px-2 !py-1"
          style={{ maxWidth: '300px', zIndex: 9999 }}
          clickable
        />
      </body>
    </html>
  );
}
