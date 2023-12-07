import { FaGithub } from 'react-icons/fa';
import './globals.css';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren } from 'react';

export default async function RootLayout({
  children,
  params,
}: PropsWithChildren<{
  params: { locale: string };
}>) {
  let messages;
  try {
    messages = (await import(`@/../messages/${params.locale}.json`)).default;
  } catch (error) {
    notFound();
  }
  return (
    <html data-theme="night" suppressHydrationWarning lang={params.locale}>
      <title>FlowGen</title>
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
            <a href="https://github.com/tiwater/flowgen" target="_blank">
              <FaGithub className="h-6 w-6" />
            </a>
          </div>
          <NextIntlClientProvider locale={params.locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </div>

      </body>
    </html>
  );
}
