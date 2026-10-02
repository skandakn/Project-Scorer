import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ProjectProvider } from '@/lib/store/projectContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HackScore AI — AI Hackathon Judge & Project Coach',
  description:
    'Turn your hackathon project into a judge-ready project. AI-powered evaluation, technical review, UI/UX audit, pitch coaching, and prioritized improvement roadmap.',
  keywords: [
    'hackathon',
    'AI judge',
    'project score',
    'pitch coach',
    'technical review',
    'hackathon preparation',
    'developer tools',
  ],
  authors: [{ name: 'HackScore AI Team' }],
  openGraph: {
    title: 'HackScore AI — AI Hackathon Judge & Project Coach',
    description: 'Turn your hackathon project into a judge-ready project.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col bg-[#070a13] text-gray-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200`}
      >
        <ProjectProvider>{children}</ProjectProvider>
      </body>
    </html>
  );
}
