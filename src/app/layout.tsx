import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';
import { AnalyticsTracker } from '@/components/layout/AnalyticsTracker';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { SITE_LANDING_IMAGE_URL, SITE_NAME } from '@/lib/constants';

function getMetadataBase(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL);
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL('http://localhost:3000');
}

const siteDescription =
  'La verdadera milanesa artesanal. Crujiente por fuera, increíble por dentro.';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: `${SITE_NAME} — Milanesas con mucho sabor`,
  description: siteDescription,
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Milanesas con mucho sabor`,
    description: siteDescription,
    images: [
      {
        url: SITE_LANDING_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — milanesa artesanal`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Milanesas con mucho sabor`,
    description: siteDescription,
    images: [SITE_LANDING_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
        <AnalyticsTracker />
        <ToastContainer />
      </body>
    </html>
  );
}
