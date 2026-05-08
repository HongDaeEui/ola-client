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
  title: {
    template: '%s | 올라랩(OlaLab) - 올라 AI 커뮤니티',
    default: '올라랩(OlaLab) | 올라 AI (Ola AI) 커뮤니티',
  },
  description: '올라랩(OlaLab)은 AI 시대를 위한 지식 공유 커뮤니티, 올라 AI 플랫폼입니다. 최신 인공지능 도구, 프롬프트, 활용 노하우를 만나보세요.',
  keywords: ['올라랩', 'OlaLab', '올라ai', '올라 AI', 'Ola AI', 'AI 커뮤니티', '프롬프트', '인공지능 도구', 'LLM', 'AI 노하우'],
  openGraph: {
    title: '올라랩(OlaLab) | 올라 AI (Ola AI) 커뮤니티',
    description: '올라랩(OlaLab)은 AI 시대를 위한 지식 공유 커뮤니티, 올라 AI 플랫폼입니다.',
    siteName: 'OlaLab',
    locale: 'ko_KR',
    type: 'website',
  },
  verification: {
    google: 'XeJUenidK3zxi-QwS68OUHg84PwHK-ug8g6XhGuFCWM',
  },
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
          <div className="grow">
            {children}
          </div>
          <Footer />
          <ChatWidget />
        </AuthProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
