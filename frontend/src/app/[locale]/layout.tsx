import './globals.css';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren } from 'react';
import Navbar from './components/navbar/Navbar';
import Providers from './providers';

export default async function RootLayout({
  children,
  params,
}: PropsWithChildren<{
  params: { locale: string };
}>) {
  console.log('params', params);
  let messages;
  try {
    messages = (await import(`@/messages/${params.locale || 'en'}.json`)).default;
  } catch (error) {
    notFound();
  }
  return (
    <html data-theme="dim" suppressHydrationWarning lang={params.locale}>
      <title>Agentok Studio</title>
      <body className={inter.className} suppressHydrationWarning>
        <div className="flex flex-col h-screen w-full items-center text-base-content">
          <NextIntlClientProvider locale={params.locale} messages={messages}>
            <Providers>
              <Navbar />
              <div className="flex flex-1 w-full overflow-y-auto">
                {children}
              </div>
            </Providers>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
