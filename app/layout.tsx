import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Abidjan Cargo Tracking - Suivez votre colis',
  description: 'Système de suivi de colis pour Abidjan Cargo Tracking',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-cargo-light">
        {children}
      </body>
    </html>
  );
}
