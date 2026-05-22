import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Real Roleplay',
  description: 'Law vs Chaos • GTA-inspired roleplay city',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/logo.png'
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
