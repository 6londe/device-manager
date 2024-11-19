import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Armstrong Device Manager',
  description: 'Armstrong Device Manager',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
