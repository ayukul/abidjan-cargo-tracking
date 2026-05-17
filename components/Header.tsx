'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package } from 'lucide-react';

interface HeaderProps {
  isAdmin?: boolean;
}

export default function Header({ isAdmin = false }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="bg-cargo-blue text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-cargo-orange rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Abidjan Cargo</h1>
            <p className="text-xs text-blue-100">Tracking</p>
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/track"
            className={`transition-colors ${
              pathname === '/track'
                ? 'text-cargo-orange font-semibold'
                : 'hover:text-blue-100'
            }`}
          >
            Suivre un colis
          </Link>

          {isAdmin && (
            <>
              <span className="text-blue-200">|</span>
              <Link
                href="/admin"
                className={`transition-colors ${
                  pathname.startsWith('/admin')
                    ? 'text-cargo-orange font-semibold'
                    : 'hover:text-blue-100'
                }`}
              >
                Tableau de bord
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
