'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getShipmentStats, getAllShipments, deleteShipment, searchShipments } from '@/lib/shipments';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardCard from '@/components/DashboardCard';
import ShipmentsTable from '@/components/ShipmentsTable';
import { Shipment } from '@/lib/supabase';
import { Package, Truck, CheckCircle, AlertTriangle, LogOut, Plus, Search } from 'lucide-react';
import { useState as useStateImport } from 'react';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, inTransit: 0, delivered: 0, delayed: 0 });
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'tracking_code' | 'customer_name' | 'customer_phone'>(
    'tracking_code'
  );
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data?.session) {
        router.push('/admin/login');
        return;
      }
      setUser(data.session.user as any);
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/admin/login');
    }
  };

  const loadData = async () => {
    try {
      const statsData = await getShipmentStats();
      setStats(statsData);

      const { shipments: shipmentsData } = await getAllShipments(20);
      setShipments(shipmentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadData();
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await searchShipments(searchQuery, searchType);
      setShipments(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce colis ?')) return;

    try {
      await deleteShipment(id);
      setShipments(shipments.filter(s => s.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-cargo-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-cargo-dark">Tableau de Bord</h1>
            <p className="text-gray-600">Bienvenue, {user?.email}</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Link href="/admin/shipments/new" className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouveau colis
            </Link>
            <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DashboardCard
            title="Total de colis"
            value={stats.total}
            icon={<Package className="w-8 h-8" />}
            color="blue"
          />
          <DashboardCard
            title="En transit"
            value={stats.inTransit}
            icon={<Truck className="w-8 h-8" />}
            color="orange"
          />
          <DashboardCard
            title="Livrés"
            value={stats.delivered}
            icon={<CheckCircle className="w-8 h-8" />}
            color="green"
          />
          <DashboardCard
            title="Retardés"
            value={stats.delayed}
            icon={<AlertTriangle className="w-8 h-8" />}
            color="red"
          />
        </div>

        {/* Search Section */}
        <div className="card mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Rechercher des colis
          </h2>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Entrez un code de suivi, nom client, ou numéro de téléphone..."
                className="input-base flex-1"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Rechercher
              </button>
              {hasSearched && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setHasSearched(false);
                    loadData();
                  }}
                  className="btn-secondary whitespace-nowrap"
                >
                  Réinitialiser
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {(['tracking_code', 'customer_name', 'customer_phone'] as const).map((type) => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="searchType"
                    value={type}
                    checked={searchType === type}
                    onChange={(e) => setSearchType(e.target.value as any)}
                  />
                  {type === 'tracking_code' && 'Code de suivi'}
                  {type === 'customer_name' && 'Nom du client'}
                  {type === 'customer_phone' && 'Téléphone'}
                </label>
              ))}
            </div>
          </form>
        </div>

        {/* Shipments Table */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {hasSearched ? 'Résultats de recherche' : 'Tous les colis'}
          </h2>
          {isLoading ? (
            <div className="card text-center py-12">
              <p className="text-gray-500">Chargement...</p>
            </div>
          ) : (
            <ShipmentsTable shipments={shipments} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </main>
  );
}
