import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Real Roleplay',
  description: 'LIKE A REAL LIFE • GTA V Roleplay Community | Luật lệ rõ ràng, trải nghiệm điện ảnh, cộng đồng văn minh.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/logo.png'
  },
  openGraph: {
    title: 'Real Roleplay',
    description: 'LIKE A REAL LIFE • GTA V Roleplay Community | Real Roleplay Vietnam',
    url: 'https://realroleplay.net',
    siteName: 'Real Roleplay',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Real Roleplay'
      }
    ],
    locale: 'vi_VN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Roleplay',
    description: 'LIKE A REAL LIFE • GTA V Roleplay Community | Real Roleplay Vietnam',
    images: ['/og-image.png']
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
