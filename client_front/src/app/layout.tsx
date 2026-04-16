import type { Metadata } from 'next';
import './globals.css';
import { TopNavBar } from '../components/layout/TopNavBar';
import { Footer } from '../components/layout/Footer';
import { AuthProvider } from '../context/AuthContext';
import { ChatWidget } from '../components/ChatWidget';

export const metadata: Metadata = {
  title: 'Ola AI Community - The Luminous Horizon',
  description: 'A community-driven ecosystem designed for luminous thinkers, creators, and builders in the age of artificial intelligence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light sm:scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" as="style" crossOrigin="" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface min-h-screen selection:bg-primary-container selection:text-on-primary-container antialiased flex flex-col">
        <AuthProvider>
          <TopNavBar />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
