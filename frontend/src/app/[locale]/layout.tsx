import { FaGithub } from 'react-icons/fa';
import './globals.css';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren } from 'react';
import { RiAppsLine, RiRobot2Line } from 'react-icons/ri';
import Link from 'next/link';
import Image from 'next/image';
import { PiChatsCircleFill } from 'react-icons/pi';

export default async function RootLayout({
  children,
  params,
}: PropsWithChildren<{
  params: { locale: string };
}>) {
  let messages;
  try {
    messages = (await import(`@/messages/${params.locale}.json`)).default;
  } catch (error) {
    notFound();
  }
  return (
    <html data-theme="dim" suppressHydrationWarning lang={params.locale}>
      <title>FlowGen</title>
      <body className={inter.className} suppressHydrationWarning>
        <div className="flex flex-col h-screen w-full items-center text-base-content">
          <div className="navbar flex w-full items-center justify-between h-12 p-2">
            <div className="navbar-start">
              <a href="/" className="flex gap-2 items-end">
                <Image
                  width={128}
                  height={32}
                  alt="logo"
                  src="/logo-full-white.png"
                  className="h-8 object-contain aspect-w-1 aspect-h-1"
                />
              </a>
            </div>
            <div className="navbar-center gap-6">
              <Link
                href="/flow"
                className="flex items-center gap-2"
              >
                <RiRobot2Line className="h-5 w-5" />
                Build
              </Link>
              <Link
                href="/chat"
                className="flex items-center gap-2"
              >
                <PiChatsCircleFill className="h-5 w-5" />
                Chat
              </Link>
              <Link
                href="/gallery"
                className="flex items-center gap-2"
              >
                <RiAppsLine className="h-5 w-5" />
                Gallery
              </Link>
            </div>
            <div className="navbar-end">
              <a href="https://github.com/tiwater/flowgen" target="_blank">
                <FaGithub className="h-5 w-5" />
              </a>
            </div>
          </div>
          <NextIntlClientProvider locale={params.locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
