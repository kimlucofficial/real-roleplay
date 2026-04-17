import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Real Roleplay',
  description: 'Law vs Chaos • GTA-inspired roleplay city'
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
