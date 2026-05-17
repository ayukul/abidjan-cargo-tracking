'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import TrackingForm from '@/components/TrackingForm';
import ShipmentDetails from '@/components/ShipmentDetails';
import Timeline from '@/components/Timeline';
import { getShipmentWithHistory } from '@/lib/shipments';
import { Shipment, ShipmentStatusHistory } from '@/lib/supabase';

export default function TrackPage() {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [history, setHistory] = useState<ShipmentStatusHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (trackingCode: string) => {
    setIsLoading(true);
    setError('');
    setSearched(true);

    try {
      const result = await getShipmentWithHistory(trackingCode);

      if (!result) {
        setError('Ce numéro de suivi n\'existe pas dans notre système. Vérifiez-le et réessayez.');
        setShipment(null);
        setHistory([]);
        return;
      }

      setShipment(result.shipment);
      setHistory(result.history);
    } catch (err) {
      console.error('Error searching for shipment:', err);
      setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
      setShipment(null);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-80px)] bg-cargo-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search Section */}
          <div className="card mb-12 shadow-lg">
            <h1 className="text-3xl font-bold mb-2 text-cargo-dark">Suivre votre colis</h1>
            <p className="text-gray-600 mb-6">
              Entrez votre numéro de suivi pour voir le statut en temps réel de votre expédition
            </p>
            <TrackingForm
              onSearch={handleSearch}
              isLoading={isLoading}
              error={error && searched ? error : ''}
            />
          </div>

          {/* Results Section */}
          {shipment && (
            <div className="space-y-6">
              <ShipmentDetails shipment={shipment} />
              {history.length > 0 && <Timeline history={history} />}
            </div>
          )}

          {/* No Search Made */}
          {!searched && !shipment && (
            <div className="card text-center py-12 bg-blue-50 border-blue-200">
              <h2 className="text-xl font-semibold text-cargo-blue mb-2">
                Besoin d'aide ?
              </h2>
              <p className="text-gray-600 mb-4">
                Entrez votre numéro de suivi dans le formulaire ci-dessus pour commencer
              </p>
              <p className="text-sm text-gray-500">
                Exemple de format: <span className="font-mono font-semibold">ACT-2024-001</span>
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
