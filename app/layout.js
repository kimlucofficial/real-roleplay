import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Real Roleplay',
<<<<<<< HEAD
  description: 'Law vs Chaos • GTA-inspired roleplay city',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/logo.png'
  }
=======
  description: 'Law vs Chaos • GTA-inspired roleplay city'
>>>>>>> 2561dc3f06c7c40e77a2d2b74a02da3a9c9462b8
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
