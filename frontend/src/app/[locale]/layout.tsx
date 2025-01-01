import './globals.css';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren } from 'react';
import Navbar from '@/components/navbar/navbar';
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
    messages = (await import(`@/messages/${params.locale || 'en'}.json`))
      .default;
  } catch (error) {
    notFound();
  }
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <title>Agentok Studio</title>
      <body className="flex flex-col h-screen w-full items-center">
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <Providers>
            <Navbar />
            <div className="flex flex-1 w-full overflow-y-auto">
              {children}
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
