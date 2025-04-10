import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '../components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AppCV - Sistema de Gestión de CVs con IA',
  description: 'Analiza, evalúa y gestiona CVs de manera inteligente utilizando inteligencia artificial',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full`}>
        <div className="min-h-full">
          <Navigation />
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
