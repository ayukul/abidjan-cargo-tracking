import Link from 'next/link';
import Header from '@/components/Header';
import { Package, BarChart3, Lock } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-cargo-dark to-cargo-blue text-white min-h-[calc(100vh-80px)] flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Abidjan Cargo Tracking
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8">
              Suivez vos colis en temps réel de la Chine à Abidjan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card bg-white text-cargo-dark shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-cargo-orange rounded-lg flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Suivi Publique</h3>
              <p className="text-gray-600 mb-4">
                Entrez votre numéro de suivi pour voir l'état de votre colis
              </p>
              <Link href="/track" className="btn-primary inline-block">
                Suivre maintenant
              </Link>
            </div>

            <div className="card bg-white text-cargo-dark shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-cargo-orange rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tableau de Bord Admin</h3>
              <p className="text-gray-600 mb-4">
                Gérez les colis, mises à jour de statut et notifications clients
              </p>
              <Link href="/admin" className="btn-primary inline-block">
                Accéder à l'admin
              </Link>
            </div>

            <div className="card bg-white text-cargo-dark shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-cargo-orange rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sécurisé</h3>
              <p className="text-gray-600 mb-4">
                Authentification sécurisée pour l'accès administrateur
              </p>
              <p className="text-cargo-blue font-semibold">Supabase Auth</p>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Commencez maintenant</h2>
            <p className="text-blue-100 mb-6">
              Prêt à suivre votre colis ? Cliquez sur le bouton ci-dessous
            </p>
            <Link href="/track" className="btn-accent text-lg px-8 py-3">
              Entrer un code de suivi
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
