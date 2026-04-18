import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/app/components/providers/AppProvider';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://chain-deal.vercel.app';

const miniAppEmbed = {
  version: '1',
  imageUrl: `${APP_URL}/og-image.png`,
  button: {
    title: "DEAL TODAY'S HAND",
    action: {
      type: 'launch_miniapp',
      name: 'CHAIN DEAL',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: '#111111',
    },
  },
};

export const metadata: Metadata = {
  title: 'CHAIN DEAL',
  description: 'Daily solitaire powered by Base chain data. Every day a new deck.',
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: 'CHAIN DEAL',
    description: 'Daily solitaire powered by Base chain data.',
    type: 'website',
    images: ['/og-image.png'],
  },
  other: {
    'fc:miniapp': JSON.stringify(miniAppEmbed),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
