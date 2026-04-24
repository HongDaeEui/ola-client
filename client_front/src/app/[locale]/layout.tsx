import type { Metadata } from 'next';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ChatWidget } from '@/components/ChatWidget';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Ola AI Community - The Luminous Horizon',
  description: 'A community-driven ecosystem designed for luminous thinkers, creators, and builders in the age of artificial intelligence.',
};

export default async function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <AuthProvider>
          <TopNavBar />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
          <ChatWidget />
        </AuthProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
