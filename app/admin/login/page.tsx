'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || 'Erreur de connexion');
        return;
      }

      if (data.user) {
        router.push('/admin');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-cargo-blue to-cargo-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card shadow-2xl">
          <h1 className="text-3xl font-bold text-cargo-dark mb-2">Connexion Admin</h1>
          <p className="text-gray-600 mb-6">Accédez au tableau de bord de gestion</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="label-base">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="input-base"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="label-base">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-base"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 mb-2 font-semibold">Données de test:</p>
            <p className="text-xs text-blue-800">
              Email: <span className="font-mono">admin@test.com</span>
            </p>
            <p className="text-xs text-blue-800">
              Password: <span className="font-mono">test123456</span>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-cargo-blue hover:text-cargo-dark font-medium">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
