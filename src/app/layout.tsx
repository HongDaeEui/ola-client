import type { Metadata } from 'next';
import './globals.css';
import { TopNavBar } from '../components/layout/TopNavBar';
import { Footer } from '../components/layout/Footer';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../components/ThemeProvider';
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
    <html lang="en" className="sm:scroll-smooth">
      <head>
        {/* Anti-flash: apply saved theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var t = localStorage.getItem('ola-theme');
              if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          })();
        `}} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Noto Serif KR — preload + swap for fast text rendering */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;700&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;700&display=swap"
          rel="stylesheet"
          media="print"
          // @ts-expect-error onLoad is valid on link elements
          onLoad="this.media='all'"
        />
        {/* Pretendard — async load, non-blocking */}
        <link
          rel="preload"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          media="print"
          // @ts-expect-error onLoad is valid on link elements
          onLoad="this.media='all'"
        />
        {/* Material Symbols — async load, non-blocking */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
          media="print"
          // @ts-expect-error onLoad is valid on link elements
          onLoad="this.media='all'"
        />
      </head>
      <body className="bg-surface text-on-surface min-h-screen selection:bg-primary-container selection:text-on-primary-container antialiased flex flex-col">
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
      </body>
    </html>
  );
}
